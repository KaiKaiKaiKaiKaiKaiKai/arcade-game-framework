import gsap from 'gsap'
import { Container, Sprite, Texture } from 'pixi.js'

export class Bomb extends Container {
  private bomb: Sprite
  private flame: Sprite
  private explosion: Sprite
  private wire: Sprite
  private backWire: Sprite
  private _wireLength!: number

  constructor() {
    super()

    this.sortableChildren = true

    this.bomb = Sprite.from('bomb')

    this.backWire = Sprite.from(Texture.WHITE)
    this.backWire.tint = 0xb43e50
    this.backWire.alpha = 0.5

    this.wire = Sprite.from(Texture.WHITE)
    this.wire.tint = 0xb43e50
    this.wire.height = 1
    this.wire.width = 10
    this.wire.x = this.bomb.width / 2 - this.wire.width / 2

    this.flame = Sprite.from('flame')
    this.flame.x = this.bomb.width / 2 - this.flame.width / 2
    this.flame.visible = false

    this.explosion = Sprite.from('explosion')
    this.explosion.visible = false
    this.explosion.scale.set(0)

    this.addChild(this.bomb)
    this.addChild(this.backWire)
    this.addChild(this.wire)
    this.addChild(this.flame)
    this.addChild(this.explosion)
  }

  public set wireLength(length: number) {
    this._wireLength = length

    this.wire.scale.y = this._wireLength
    this.wire.y = -this._wireLength

    this.backWire.height = this.wire.height
    this.backWire.width = this.wire.width
    this.backWire.x = this.wire.x
    this.backWire.y = this.wire.y

    this.flame.y = -this._wireLength - this.flame.height
    this.flame.scale.set(0)
  }

  public async light() {
    this.flame.visible = true

    gsap.to(this.flame.scale, {
      x: 0.5,
      y: 0.5,
      duration: 0.5,
      onUpdate: () => {
        this.flame.x = this.bomb.width / 2 - this.flame.width / 2
      },
      ease: 'sine.out',
    })
  }

  public async startTimer(duration: number) {
    await gsap.to(this.wire.scale, {
      y: 0,
      duration,
      onUpdate: () => {
        this.wire.y = -this.wire.height
        this.flame.y = -this.wire.height - this.flame.height
      },
      ease: 'none',
    })

    this.wire.visible = false
  }

  public async explode() {
    await gsap.to(this.flame.scale, {
      x: 0,
      y: 0,
      duration: 0.5,
      onUpdate: () => {
        this.flame.y = -this.wire.height - this.flame.height
        this.flame.x = this.bomb.width / 2 - this.flame.width / 2
      },
      ease: 'none',
    })

    this.flame.visible = false
    this.flame.scale.set(0)

    this.explosion.visible = true
    this.explosion.alpha = 1

    await gsap.to(this.explosion.scale, {
      x: 1,
      y: 1,
      duration: 0.5,
      ease: 'sine.out',
      onUpdate: () => {
        this.explosion.x = this.bomb.width / 2 - this.explosion.width / 2
        this.explosion.y = this.bomb.height / 2 - this.explosion.height / 2
      },
    })

    this.bomb.alpha = 0.5

    await gsap.to(this.explosion, { alpha: 0, duration: 0.2 })

    this.explosion.visible = false
    this.explosion.scale.set(0)
  }

  public async reset() {
    if (this.bomb.alpha === 1) return

    this.wire.alpha = 0
    this.wire.scale.y = this._wireLength
    this.wire.y = -this.wire.height
    this.wire.visible = true

    await Promise.all([
      gsap.to(this.bomb, { alpha: 1, duration: 0.5 }),
      gsap.to(this.wire, { alpha: 1, duration: 0.5 }),
    ])
  }
}
