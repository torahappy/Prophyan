# nurinuri

import torchvision.models as models

import torch
import torch.utils.data
import torchvision
from torchvision import transforms as T

normalize = T.Normalize(mean=[0.485, 0.456, 0.406],
                        std=[0.229, 0.224, 0.225])

transform = T.Compose([T.Resize(256), T.CenterCrop(224), T.ToTensor(), normalize])

dataloader = torch.utils.data.DataLoader(
    torchvision.datasets.ImageFolder("./", transform=transform),
    batch_size=32, shuffle=True)

def makecircle(shape, x, y, s, r, g, b):
    xpos = torch.linspace(-0.5, 0.5, shape[1]).repeat(shape[2], 1)
    ypos = torch.linspace(-0.5, 0.5, shape[2]).reshape(shape[2],1).repeat(1, shape[1])
    out = ((xpos - x) ** 2 + (ypos - y) ** 2)
    out = torch.clamp(1 - out*s, min = 0)
    out = out * torch.Tensor([[[r, g, b]]]).T
    return out

with torch.cuda.device(0):
    resnext50_32x4d = models.resnext50_32x4d(pretrained=True).cuda()
    
    for x in dataloader:
        inpp = x[0].cuda()
        rett = resnext50_32x4d(inpp)
        print(rett.argmax(axis=1))
        torchvision.utils.save_image(x[0], "aaa2.png")
    

