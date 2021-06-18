# nurinuri

import torchvision.models as models

import torch
import torch.utils.data
import torchvision
from torchvision import transforms as Ts

def makecircle(shape, x, y, s, r, g, b):
    xpos = torch.linspace(-0.5, 0.5, shape[0]).repeat(shape[1], 1)
    ypos = torch.linspace(-0.5, 0.5, shape[1]).reshape(shape[1],1).repeat(1, shape[0])
    out = ((xpos - x) ** 2 + (ypos - y) ** 2)
    out = torch.clamp(1 - out*s, min = 0)
    out = out * torch.Tensor([[[r, g, b]]]).T
    return out

with torch.cuda.device(0):
    x = makecircle((64, 64), 0.1, 0.1, 100, 0.7, 0.4, 0.2)
    torchvision.utils.save_image(x, "aaa2.exp.png")
