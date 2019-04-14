import 'babel-polyfill'
import * as tf from '@tensorflow/tfjs'


class FontColorPredictor {
    constructor() {
        const model = tf.sequential()

        model.add(tf.layers.dense({
            inputShape: [3],
            units: 5,
            activation: 'relu'
        }))
        
        model.add(tf.layers.dense({
            units: 3,
            activation: 'sigmoid'
        }))
        
        model.add(tf.layers.dense({
            units: 2,
            activation: 'softmax'
        }))
        
        model.compile({
            optimizer: 'rmsprop', //tf.train.sgd(0.000001),
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        })
        
        this.model = model
    }

    learning({xs, ys}) {
        const { model } = this
        const batchSize = parseInt(xs.length * 0.8)

        xs = tf.variable(tf.tensor(xs))
        ys = tf.variable(tf.tensor(ys))

        const onBatchEnd = (t, info) => {
            console.log('onBatchEnd', info.acc)
        }
        
        console.log('batchSize:', batchSize)
        return model.fit(xs, ys, {
            epochs: 512,
            batchSize,
            callbacks: {onBatchEnd}
        })
    }

    predict(color) {
       const { model } = this
       const c = tf.variable(tf.tensor([color]))
       return model.predict(c).dataSync()
    }
}


export default FontColorPredictor
