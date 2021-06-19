# nurinuri

import torchvision.models as models

import torch
import torch.utils.data
import torchvision
from torchvision import transforms as T

with torch.cuda.device(0):
    w = 224
    mean = 0.4
    std = 0.2
    batches = 32
    inpp = (torch.randn(size=(batches, 3, w, w))*std + mean).cuda().requires_grad_()
    torchvision.utils.save_image(inpp, "aaa3s.png")

    criterion = torch.nn.MSELoss(reduction='sum').cuda()
    optimizer = torch.optim.Adam([inpp], lr=0.001)
    resnext50_32x4d = models.resnext50_32x4d(pretrained=True).cuda()
    
    rett = resnext50_32x4d(inpp)
    classes = rett.argmax(axis=1)

    for i in range(50000):
        loss = 0
        for k in range(classes.shape[0]):
            loss -= torch.softmax(rett[k], 0)[classes[k]]
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        print(loss)
        rett = resnext50_32x4d(inpp)

    torchvision.utils.save_image(inpp, "aaa3e.png")
    
