# nurinuri

import torchvision.models as models

import torch
import torch.utils.data
import torchvision
from torchvision import transforms as T

with torch.cuda.device(0):
    base = (torch.randn(size=(32, 3, 224, 224))*0.2 + 0.4).cuda()
    params = torch.rand(size=(32, 6)).cuda().requires_grad_()
    torchvision.utils.save_image(base, "aaa4s.png")

    criterion = torch.nn.MSELoss(reduction='sum').cuda()
    optimizer = torch.optim.Adam([params])
    resnext50_32x4d = models.resnext50_32x4d(pretrained=True).cuda()

    inpp = base + 
    
    rett = resnext50_32x4d(inpp)
    classes = rett.argmax(axis=1)

    for i in range(100):
        loss = 0
        for k in range(classes.shape[0]):
            loss -= rett[k,classes[k]]
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        print(loss)
        rett = resnext50_32x4d(inpp)

    torchvision.utils.save_image(inpp, "aaa4e.png")
    
