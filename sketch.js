// let capturer
let canvas
const fps = 60
const pointFPS = 60

const sketch = (p) => {
	const waves = []
	let numPaths
	let completionTime

	p.preload = () => { }

	p.setup = () => {
		// capturer = new CCapture({ format: 'gif', workersPath: 'js/' })
		canvas = p.createCanvas(p.windowWidth, p.windowHeight)
		p.stroke(255, 0, 0)
		p.circle(p.width / 2, p.height / 2, 10, 10)
		// p.stroke(0)
		// p.strokeWeight(0.5)

		let infoString = ''
		const numWaves = p.floor(p.random(2, 6))
		infoString += `number of waves: ${numWaves}\n`
		for (let i = 0; i < numWaves; i++) {
			const wave = {
				initialAngle: p.random(p.TWO_PI),
				angularSpeed: p.random() > 0.5 ? p.floor(p.random(1, 6)) : p.floor(p.random(-5, 0)),
				radius: p.random(10, Math.min(p.width, p.height) / (numWaves * 2))
			}
			waves.push(wave)
			console.log(wave);
			infoString += `{initialAngle: ${wave.initialAngle}, angularSpeed: ${wave.angularSpeed}, radius: ${wave.radius}}\n`
		}
		numPaths = p.floor(p.random(10, 20))
		infoString += `number of paths: ${numPaths}`
		// document.getElementById('info').innerText = infoString

		const minSpeed = Math.min(...waves.map(wave => Math.abs(wave.angularSpeed)))
		completionTime = p.TWO_PI / minSpeed
	}

	p.draw = () => {
		let newTime = p.frameCount / fps
		if (newTime <= completionTime) {
			p.stroke(0)
			p.strokeWeight(0.5)
		} else if (newTime <= 2 * completionTime) {
			p.stroke(255)
			p.strokeWeight(1.5)
			newTime -= completionTime
		} else {
			onFinish()
			p.noLoop()
		}

		p.translate(p.width / 2, p.height / 2)
		for (let angleOffset = 0; angleOffset < 2 * Math.PI; angleOffset += 2 * Math.PI / numPaths) {
			// if (angleOffset !== 0) continue
			for (let t = newTime - 1 / fps; t < newTime; t += 1 / pointFPS) {
				const currentPosition = getPosition(t, waves, angleOffset)
				const newPosition = getPosition(t + 1 / pointFPS, waves, angleOffset)

				p.line(...currentPosition, ...newPosition)
			}
		}

		// if (p.frameCount === 1) capturer.start()
		// capturer.capture(canvas.elt)

		// if (frameCount === 60 * 5) {
		// 	capturer.stop()
		// 	capturer.save()
		// 	p.noLoop()
		// }
	}
}

const getPosition = (t, waves, angleOffset) => {
	const position = [0, 0]
	for (let i = 0; i < waves.length; i++) {
		const wave = waves[i]
		const angle = angleOffset + wave.initialAngle + t * wave.angularSpeed
		position[0] += wave.radius * Math.cos(angle)
		position[1] += wave.radius * Math.sin(angle)
	}
	return position
}

const sketchDiv = document.getElementById('sketch')
let myp5 = new p5(sketch, sketchDiv)

const onFinish = () => {
	myp5.remove()
	myp5 = new p5(sketch, sketchDiv)
}
