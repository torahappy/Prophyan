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
    
    # only consider the first batch
    x = list(dataloader)[0]
    inpp = x[0].cuda()
    params = (torch.Tensor([0.1, 0.1, 10, 0.03, 0.02, 0.01]).repeat(inpp.shape[0],1)).cuda().requires_grad_()
    criterion = torch.nn.MSELoss(reduction='sum').cuda()
    optimizer = torch.optim.Adam([params], lr=0.001)

    rett = resnext50_32x4d(inpp)
    print(rett.argmax(axis=1))
    torchvision.utils.save_image(x[0], "aaa2-2s.png")
    

