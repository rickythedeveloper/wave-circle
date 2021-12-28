// let capturer
let canvas

const sketch = (p) => {
	p.preload = () => { }

	p.setup = () => {
		// capturer = new CCapture({ format: 'gif', workersPath: 'js/' })
		canvas = p.createCanvas(500, 500)
		p.background(255, 0, 0)
		p.circle(p.width / 2, p.height / 2, 500, 500)
	}

	p.draw = () => {
		// if (p.frameCount === 1) capturer.start()
		// capturer.capture(canvas.elt)

		// if (frameCount === 60 * 5) {
		// 	capturer.stop()
		// 	capturer.save()
		// 	p.noLoop()
		// }
	}
}

const sketchDiv = document.getElementById('sketch')
const myp5 = new p5(sketch, sketchDiv)