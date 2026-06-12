# nurinuri

import torchvision.models as models

import torch
import torch.utils.data
import torchvision
from torchvision import transforms as T

# -0.5 0.5, -0.5 0.5, 10 - 1000 log?, 0 - 0.05, 0 - 0.05, 0 - 0.05
def makecircle(shape, x, y, s, r, g, b):
    xpos = torch.linspace(-0.5, 0.5, shape[0]).repeat(shape[1], 1).cuda()
    ypos = torch.linspace(-0.5, 0.5, shape[1]).reshape(shape[1],1).repeat(1, shape[0]).cuda()
    out = ((xpos - x) ** 2 + (ypos - y) ** 2)
    out = torch.clamp(1 - out*s, min = 0)
    out = out * torch.Tensor([[[r, g, b]]]).T.cuda()
    return out

with torch.cuda.device(0):
    resnext50_32x4d = models.resnext50_32x4d(pretrained=True).cuda()
    w = 224
    mean = 0.4
    std = 0.2
    batches = 32
    inpp = (torch.randn(size=(batches, 3, w, w))*std + mean).cuda()

    params = (torch.Tensor([0.1, 0.1, 10, 0.03, 0.02, 0.01]).repeat(batches,1)).cuda().requires_grad_()

    criterion = torch.nn.MSELoss(reduction='sum').cuda()
    optimizer = torch.optim.Adam([params], lr=0.1)

    for i in range(100):
        addd = torch.zeros(size=(batches, 3, w, w)).cuda()
        for k in range(batches):
            p = params[k]
            addd += makecircle((w, w), p[0], p[1], p[2], p[3], p[4], p[5])
        rett = resnext50_32x4d(inpp + addd)
        if i == 0:
            torchvision.utils.save_image(inpp + addd, __file__ + ".s.png")
            classes = rett.argmax(axis=1)
        loss = 0
        for k in range(batches):
            loss -= torch.softmax(rett[k], 0)[classes[k]]
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        print(loss)
    
    print(params)
    
    torchvision.utils.save_image(inpp + addd, __file__ + ".e.png")


