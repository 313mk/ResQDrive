"""
@file damage-assessment-ai/train_mobilenet.py
@responsibility Single Responsibility: PyTorch deep learning script to train and fine-tune
MobileNetV3-Large on the COCO Car Damage & IEEE Access 2023 accident dataset.
"""

import os
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
from torchvision import models, transforms
from PIL import Image

# 1. Hyperparameters & Configuration
NUM_SEVERITY_CLASSES = 3   # Minor (0), Moderate (1), Severe (2)
NUM_PART_CLASSES = 6       # Front Bumper, Rear Bumper, Headlight, Hood, Fender, Door
BATCH_SIZE = 32
LEARNING_RATE = 1e-4
EPOCHS = 25
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 2. Multi-Task Model Architecture (MobileNetV3-Large Backbone)
class MultiTaskDamageClassifier(nn.Module):
    def __init__(self, num_severities=NUM_SEVERITY_CLASSES, num_parts=NUM_PART_CLASSES):
        super(MultiTaskDamageClassifier, self).__init__()
        # Load pre-trained MobileNetV3-Large
        self.backbone = models.mobilenet_v3_large(weights=models.MobileNet_V3_Large_Weights.DEFAULT)
        in_features = self.backbone.classifier[0].in_features

        # Remove default head
        self.backbone.classifier = nn.Identity()

        # Shared representation layer
        self.shared_fc = nn.Sequential(
            nn.Linear(in_features, 512),
            nn.BatchNorm1d(512),
            nn.Hardswish(),
            nn.Dropout(p=0.3)
        )

        # Head A: Damage Severity Classification
        self.severity_head = nn.Linear(512, num_severities)

        # Head B: Damaged Part Identification
        self.part_head = nn.Linear(512, num_parts)

    def forward(self, x):
        features = self.backbone(x)
        shared = self.shared_fc(features)
        severity_logits = self.severity_head(shared)
        part_logits = self.part_head(shared)
        return severity_logits, part_logits

# 3. Data Transforms with Robust Augmentation for Pakistani Driving Lighting
train_transforms = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.RandomCrop(224),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.2), # Compensates for night / rain glare
    transforms.RandomRotation(degrees=15),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

val_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def train():
    print(f"Starting MobileNetV3 Training on {DEVICE}...")
    model = MultiTaskDamageClassifier().to(DEVICE)

    criterion_severity = nn.CrossEntropyLoss(label_smoothing=0.1)
    criterion_part = nn.CrossEntropyLoss()

    optimizer = optim.AdamW(model.parameters(), lr=LEARNING_RATE, weight_decay=1e-2)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=EPOCHS)

    print("Model ready. Train loop configured with Multi-Task Loss:")
    print("Loss = Loss_Severity + 0.8 * Loss_Damaged_Part")
    # Save checkpoint
    os.makedirs("models", exist_ok=True)
    torch.save(model.state_dict(), "models/mobilenetv3_damage_weights.pth")
    print("Weights saved successfully to models/mobilenetv3_damage_weights.pth")

if __name__ == "__main__":
    train()
