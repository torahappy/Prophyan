# nurinuri

import torchvision.models as models

import torch
import torch.utils.data
import torchvision
from torchvision import transforms as T

# -0.5 0.5, -0.5 0.5, 10 - 1000 log?, 0 - 0.05, 0 - 0.05, 0 - 0.05
def makecircles(shape, params):
    [x, y, s, r, g, b] = params.T
    xpos = torch.linspace(-0.5, 0.5, shape[0]).repeat(shape[1], 1).cuda()
    ypos = torch.linspace(-0.5, 0.5, shape[1]).reshape(shape[1],1).repeat(1, shape[0]).cuda()
    pts = x.shape[0]
    out = ((xpos.repeat(pts,1,1) - x.reshape(pts,1,1)) ** 2 + (ypos.repeat(pts,1,1) - y.reshape(pts,1,1)) ** 2)
    out = torch.clamp(1 - out*s.reshape(pts,1,1), min = 0)
    print(out.repeat(3,1,1,1).shape, torch.stack([r, g, b]).reshape(3, pts, 1, 1).shape)
    out = out.repeat(3,1,1,1) * torch.stack([r, g, b]).reshape(3, pts, 1, 1)
    return out.sum(1)

with torch.cuda.device(0):
    resnext50_32x4d = models.resnext50_32x4d(pretrained=True).cuda()
    w = 224
    mean = 0.4
    std = 0.2

    points = 1000

    params = torch.stack([
        torch.rand(points) - 0.5,
        torch.rand(points) - 0.5,
        90*torch.rand(points) + 10,
        torch.rand(points)*0.04,
        torch.rand(points)*0.04,
        torch.rand(points)*0.04,
    ]).T.cuda().requires_grad_()

    print(params.shape)

    criterion = torch.nn.MSELoss(reduction='sum').cuda()
    optimizer = torch.optim.Adam([params], lr=0.001)

    for i in range(1000):
        addd = makecircles((w, w), params).reshape(1, 3, w, w)
        rett = resnext50_32x4d(addd)
        if i == 0:
            torchvision.utils.save_image(addd, __file__ + ".s.png")
            classid = 123
        loss = -torch.softmax(rett, 1)[0, classid]
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        print(loss)

    torchvision.utils.save_image(addd, __file__ + ".e.png")
