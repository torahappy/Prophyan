import torchvision.models as models

import torch
import torch.utils.data
import torchvision
from torchvision import transforms as T
import torch.nn.functional as F

# lapulacian sum loss

with torch.cuda.device(0):
    w = 224
    mean = 0.4
    std = 0.2
    batches = 1
    inpp = (torch.randn(size=(batches, 3, w, w))*std + mean).cuda().requires_grad_()
    torchvision.utils.save_image(inpp, "aaa3lss.png")

    criterion = torch.nn.MSELoss(reduction='sum').cuda()
    optimizer = torch.optim.Adam([inpp], lr=0.001)
    resnext50_32x4d = models.resnext50_32x4d(pretrained=True).cuda()

    rett = resnext50_32x4d(inpp)
    classes = rett.argmax(axis=1)

    for i in range(30000):
        loss1 = torch.Tensor(classes.shape[0]).cuda()
        for k in range(classes.shape[0]):
            loss1[k] = -torch.softmax(rett[k], 0)[classes[k]]

        cnvd = F.conv2d(inpp, torch.Tensor([[0,1,0],[1,-4,1],[0,1,0]]).cuda().repeat(3,1,1).reshape(3, 1, 3, 3), groups=3)
        loss2 = torch.abs(cnvd).sum()
            
        loss = (loss1.sum() + loss2.sum()/25000)/batches

        print(loss)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        rett = resnext50_32x4d(inpp)
        print(loss)

    torchvision.utils.save_image(inpp, "aaa3lse.png")
    
