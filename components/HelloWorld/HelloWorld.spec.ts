import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import HelloWorld from './index.vue'

describe('HelloWorld', () => {
  it('component renders Hello world properly', () => {
    const wrapper = mount(HelloWorld)
    expect(wrapper.text()).toContain('Hello world')
  })
})