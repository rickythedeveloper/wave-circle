// let capturer
let canvas
const fps = 60
const pointFPS = 60
const width = 2000
const height = width //width * Math.sqrt(2)
let iteration = 0
const numIterations = 10

const sketch = (p) => {
	const waves = []
	let numPaths
	let completionTime
	let strokeColor

	p.setup = () => {
		canvas = p.createCanvas(width, height)
		// p.stroke(255, 0, 0)
		// p.circle(p.width / 2, p.height / 2, 10, 10)

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

		const speeds = waves.map(wave => Math.abs(wave.angularSpeed))
		completionTime = p.TWO_PI / greatestCommonDivisor(...speeds)

		const maxPossibleSize = sum(...waves.map(w => w.radius)) * 2
		const scale = p.width / maxPossibleSize

		p.strokeWeight(p.width / 1000 / scale)
		p.translate(p.width / 2, p.height / 2)
		p.scale(scale)
		p.colorMode(p.HSB)
		strokeColor = [0, 100, 70]
		const nTimes = pointFPS * completionTime
		const colorChange = 2 * 360 / nTimes
		for (let t = 0; t < completionTime; t += 1 / pointFPS) {
			strokeColor[0] += t < completionTime / 2 ? colorChange : -colorChange
			p.stroke(...strokeColor)
			for (let angleOffset = 0; angleOffset < 2 * Math.PI; angleOffset += 2 * Math.PI / numPaths) {
				const currentPosition = getPosition(t, waves, angleOffset)
				const newPosition = getPosition(t + 1 / pointFPS, waves, angleOffset)
				p.line(...currentPosition, ...newPosition)
			}
		}

		p.noLoop()
		p.saveCanvas(`spirography`, 'png')
		setTimeout(() => {
			const textSize = p.width / scale / 5.5
			p.rectMode(p.CENTER)
			p.textSize(textSize)
			p.noStroke()
			p.colorMode(p.RGB)
			p.fill(120, 100)
			p.textAlign(p.CENTER)
			p.text("Watermark", 0, 0, p.width / scale, textSize)
			p.saveCanvas(`spirography_display`, 'png')
			setTimeout(() => {
				onFinish()
			}, 1000)
		}, 1000)
	}
}

const greatestCommonDivisor = (...numbers) => {
	if (numbers.length < 2) throw new Error('gcd needs two numbers or more')
	if (numbers.length === 2) return greatestCommonDivisor_2(...numbers)
	return greatestCommonDivisor(
		greatestCommonDivisor_2(numbers[0], numbers[1]),
		...numbers.slice(2)
	)
}
const greatestCommonDivisor_2 = function (a, b) {
	if (!b) return a
	return greatestCommonDivisor_2(b, a % b);
}

const sum = (...numbers) => {
	let val = 0
	for (let i = 0; i < numbers.length; i++) val += numbers[i]
	return val
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
	iteration += 1
	if (iteration < numIterations) {
		myp5 = new p5(sketch, sketchDiv)
	}
}
