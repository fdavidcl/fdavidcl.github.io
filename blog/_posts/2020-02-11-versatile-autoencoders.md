---
layout: post
title: Versatile workflow for autoencoders in Keras
---

## Architecture definition

This code defines the simplest architecture: [input, encoding (2), output]

```python
enc_dim = 2

encoder = tf.keras.Sequential([
    tf.keras.layers.Dense(enc_dim, activation="relu", input_shape=(data.shape[1], ))
])
decoder = tf.keras.Sequential([
    tf.keras.layers.Dense(data.shape[1], activation="sigmoid", input_shape=(enc_dim,))
])
```

## Definition of a loss function

Defining the loss as a function allows us much more flexibility to compute penalties from the encodings, or even other inputs (supervised autoencoders).

```python
def autoencoder_loss(layers):
    inp, enc, out = layers
    rec_loss = K.binary_crossentropy(inp, out)
    # compute other penalties
    loss = rec_loss # + other penalties
    return loss
```

## Definition of the loss layer and the model

The loss function is wrapped as the last layer of the autoencoder model and connected to the necessary inputs/outputs.

```python
loss_l = tf.keras.layers.Lambda(autoencoder_loss, output_shape=(1,), name="loss")([
    encoder.input, encoder.output, decoder(encoder(encoder.input))
])

autoencoder = tf.keras.Model([encoder.input, target_input], loss_l)
```

## Compilation of model with custom loss

Since the last layer (`y_pred`) is actually the loss, our custom loss only needs to return that value.

```python
autoencoder.compile(loss={'loss': lambda y_true, y_pred: y_pred}, optimizer="adam")
```

## Fit model with dummy target

Keras will complain if no target is passed, so we just create some dummy targets which will not be used at all.

```python
hist = autoencoder.fit(data, np.zeros(data.shape[0]), batch_size=8, epochs = 100)
```
