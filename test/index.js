'use strict'

const createScatter = require('../index')
const t = require('tape')
const load = require('image-pixels')
const eq = require('image-equal')
const out = require('image-output')
const seed = require('seed-random')
const regl = require('regl')({
	gl: require('gl')(200, 200),
	attributes: {preserveDrawingBuffer: true},
	extensions: ['OES_element_index_uint']
})


t('colors/shapes', async t => {
	//create square test sdf image
	let w = 200, h = 200
	let dist = new Array(w*h)
	for (let i = 0; i < w; i++) {
		for (let j = 0; j < h; j++) {
			if (i > j) {
				if (i < h - j) {
					dist[j*w + i] = j/(h/2)
				}
				else {
					dist[j*w + i] = 1 - (i-w/2)/(w/2)
				}
			}
			else {
				if (i < h - j) {
					dist[j*w + i] = i/(w/2)
				}
				else {
					dist[j*w + i] = 1 - (j-h/2)/(h/2)
				}
			}
		}
	}

	var scatter = createScatter(regl)
	scatter.update({
		positions: [0,0, 1,1, 2,2, 3,3, 4,4, 5,5, 6,6, 7,7],
		size: 6,
		color: ['red', 'green', 'blue', 'black', 'red', 'black', 'red', 'gray'],
		marker: [null, null, null, null, dist, dist, dist, dist],
		range: [-2,-2,10,10],
		snap: false
	})
	scatter.draw()

	t.ok(eq(await load('./test/img/mixed-markers-colors.png'), scatter.gl, .05))

	regl.clear({color: [0,0,0,0]})

	t.end()
})

t('1e6 points', async t => {
	var random = seed('1e6')
	var N = 1e6
	var positions = new Float64Array(2 * N)

	for(var i=0; i<2*N; ++i) {
	  positions[i] = random()
	}

	var scatter = createScatter(regl)
	scatter.update({
		positions: positions,
		size: 2,
		color: [0,0,0,.1],
		range: [-.1,-.1,1.1,1.1]
	})
	scatter.draw()

	t.ok(eq(scatter.gl, await load('./test/img/1e6.png'), .1))
	regl.clear({color: [0,0,0,0]})

	t.end()
})

t('Color palette interference (#3232)', async t => {
	var passes = require('./3232.json')
	passes[1].color.length = 4
	passes[1].color = new Uint8Array(Array.from(passes[1].color))
	passes[1].borderColor.length = 4
	passes[1].borderColor = new Uint8Array(Array.from(passes[1].borderColor))

	var scatter = createScatter(regl)

	passes[1].range = [0,0,300,300]

	scatter.update(passes)
	scatter.render()
	t.ok(eq(scatter, await load('./test/img/3232.png'), {threshold: .1}))

	regl.clear({color: [0,0,0,0]})
	t.end()
})

t('unsnapped elements render')

t('snapped elements render')

t('multimarker multipass render')

t('too many colors render')

t('palette colors render')

t('single color render')

t('precision')

t('marker size')

t('circle size')

t('multipass rendering')

t('single point')

t('no-boundaries')

t('cluster with external buffer')


