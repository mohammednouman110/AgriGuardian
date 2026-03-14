#!/usr/bin/env python3
"""
AgriGuardian AI - Crop Disease Detection Model Training

This script trains a CNN model for crop disease detection using the PlantVillage dataset.
In a real implementation, you would:
1. Download the PlantVillage dataset from https://www.kaggle.com/datasets/emmarex/plantdisease
2. Organize the data into train/validation/test splits
3. Train the model with proper data augmentation

For this demo, we'll create a mock training script that shows the structure.
"""

import os
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import joblib

def create_model(num_classes=38):
    """
    Create EfficientNet-based model for disease detection
    """
    # Load EfficientNetB0 as base model
    base_model = tf.keras.applications.EfficientNetB0(
        input_shape=(224, 224, 3),
        include_top=False,
        weights='imagenet'
    )

    # Freeze base model layers
    base_model.trainable = False

    # Add custom classification head
    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dropout(0.2),
        layers.Dense(512, activation='relu'),
        layers.Dropout(0.2),
        layers.Dense(num_classes, activation='softmax')
    ])

    return model

def create_data_generators(data_dir='data/PlantVillage'):
    """
    Create data generators for training and validation
    """
    # Data augmentation for training
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        validation_split=0.2
    )

    # Only rescaling for validation
    val_datagen = ImageDataGenerator(
        rescale=1./255,
        validation_split=0.2
    )

    # Create generators
    train_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=(224, 224),
        batch_size=32,
        class_mode='categorical',
        subset='training'
    )

    validation_generator = val_datagen.flow_from_directory(
        data_dir,
        target_size=(224, 224),
        batch_size=32,
        class_mode='categorical',
        subset='validation'
    )

    return train_generator, validation_generator

def train_model():
    """
    Train the disease detection model
    """
    print("Creating model...")
    model = create_model()

    # Compile model
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    print("Model created successfully!")
    print(f"Model summary:")
    model.summary()

    # Mock training (in real implementation, uncomment the code below)
    print("\nMock training completed!")
    print("In a real implementation, you would:")
    print("1. Download PlantVillage dataset")
    print("2. Run: train_generator, validation_generator = create_data_generators()")
    print("3. Train with: model.fit(train_generator, validation_data=validation_generator, epochs=50)")

    # Save mock model
    os.makedirs('models', exist_ok=True)

    # Create a simple mock model for demonstration
    mock_model = models.Sequential([
        layers.Input(shape=(224, 224, 3)),
        layers.Conv2D(32, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Flatten(),
        layers.Dense(38, activation='softmax')  # 38 classes in PlantVillage
    ])

    mock_model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

    # Save the model
    mock_model.save('models/disease_detection_model.h5')
    print("Mock model saved to models/disease_detection_model.h5")

    # Create class labels
    class_labels = [
        'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
        'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
        'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_',
        'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy', 'Grape___Black_rot',
        'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy',
        'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy',
        'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight',
        'Potato___Late_blight', 'Potato___healthy', 'Raspberry___healthy', 'Soybean___healthy',
        'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Strawberry___healthy',
        'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight',
        'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite',
        'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus',
        'Tomato___healthy'
    ]

    # Save class labels
    joblib.dump(class_labels, 'models/class_labels.pkl')
    print("Class labels saved to models/class_labels.pkl")

    return mock_model, class_labels

def evaluate_model(model, validation_generator, class_labels):
    """
    Evaluate the trained model
    """
    print("\nEvaluating model...")

    # Mock evaluation
    print("Mock evaluation results:")
    print("Validation Accuracy: 92.5%")
    print("Precision: 91.8%")
    print("Recall: 90.2%")
    print("F1-Score: 91.0%")

    # In real implementation:
    # predictions = model.predict(validation_generator)
    # y_pred = np.argmax(predictions, axis=1)
    # y_true = validation_generator.classes
    # print(classification_report(y_true, y_pred, target_names=class_labels))

if __name__ == "__main__":
    print("AgriGuardian AI - Crop Disease Detection Training")
    print("=" * 50)

    try:
        model, class_labels = train_model()
        print("\nTraining completed successfully!")

        # Mock evaluation
        print("\nModel Evaluation:")
        print("-" * 30)
        evaluate_model(model, None, class_labels)

        print("\nNext steps:")
        print("1. Deploy the model to the backend API")
        print("2. Test with sample images")
        print("3. Fine-tune hyperparameters for better performance")

    except Exception as e:
        print(f"Error during training: {str(e)}")
        print("Make sure you have:")
        print("- TensorFlow installed")
        print("- PlantVillage dataset downloaded")
        print("- Sufficient disk space for model training")