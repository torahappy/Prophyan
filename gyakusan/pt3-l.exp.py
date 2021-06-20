import torchvision.models as models

import torch
import torch.utils.data
import torchvision
from torchvision import transforms as T
import torch.nn.functional as F
# lapulacian sum loss

normalize = T.Normalize(mean=[0.485, 0.456, 0.406],
                    std=[0.229, 0.224, 0.225])

transform = T.Compose([T.Resize(256), T.CenterCrop(224), T.ToTensor(), normalize])

dataloader = torch.utils.data.DataLoader(
    torchvision.datasets.ImageFolder("./dataset", transform=transform),
    batch_size=32, shuffle=True)

with torch.cuda.device(0):
    img = list(dataloader)[0][0][0]
    w = 224
    out = F.conv2d(img.reshape(1, 3, w, w), torch.Tensor([[0,1,0],[1,-4,1],[0,1,0]]).repeat(3,1,1).reshape(3, 1, 3, 3), groups=3)
    torchvision.utils.save_image(out, "aaa3lexp.png")

    
