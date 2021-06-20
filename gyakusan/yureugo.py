import torchvision.models as models

# 壊すのは簡単 戻すのは難しい
# to break is easy; to build back is difficutl

import torch
import torch.utils.data
import torchvision
from torchvision import transforms as T

normalize = T.Normalize(mean=[0.485, 0.456, 0.406],
                        std=[0.229, 0.224, 0.225])

transform = T.Compose([T.Resize(256), T.CenterCrop(224), T.ToTensor(), normalize])

dataloader = torch.utils.data.DataLoader(
    torchvision.datasets.ImageFolder("./dataset", transform=transform),
    batch_size=32, shuffle=True)

with torch.cuda.device(0):
    resnext50_32x4d = models.resnext50_32x4d(pretrained=True).cuda()

    # get first batch
    x = list(dataloader)[0]
    inpp = x[0].cuda().requires_grad_()
    criterion = torch.nn.MSELoss(reduction='sum').cuda()
    optimizer = torch.optim.Adam([inpp], lr=0.1)

    rett = resnext50_32x4d(inpp)
    classes = rett.argmax(axis=1)

    torchvision.utils.save_image(inpp, "yure_s.png")

    for i in range(10):
        if i % 2 == 1:
            cnt = 1000
        else:
            cnt = 100
        for j in range(cnt):
            loss = 0
            for k in range(classes.shape[0]):
                if i % 2 == 1:
                    c = -1
                else:
                    c = +1
                loss += c * torch.softmax(rett[k], 0)[classes[k]]
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            print(loss)
            rett = resnext50_32x4d(inpp)

        torchvision.utils.save_image(inpp, "yure_"+str(i)+".png")

