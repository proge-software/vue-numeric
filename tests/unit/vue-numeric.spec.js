/* eslint-env mocha */
import { mount, shallowMount } from '@vue/test-utils';
import VueNumeric from '@/vue-numeric.vue';

describe('vue-numeric.vue', () => {
  it('Use default decimal separator', () => {
    const wrapper = shallowMount(VueNumeric, { propsData: { modelValue: 2000 }})
    expect(wrapper.vm.amount).toBe('2,000');
  })

  it('format values with currency prefix', () => {
    const wrapper = shallowMount(VueNumeric, { propsData: { modelValue: 2000, currency: 'USD' }})
    expect(wrapper.vm.amount).toBe('USD 2,000');
  })

  it('format values with currency suffix', () => {
    const wrapper = shallowMount(VueNumeric, { propsData: { modelValue: 2000, currency: 'CZK', currencySymbolPosition: 'suffix' }})
    expect(wrapper.vm.amount).toBe('2,000 CZK');
  })

  it('format values with decimals', () => {
    const wrapper = shallowMount(VueNumeric, { propsData: { modelValue: 2000.34, precision: 2, currency: '$' }})
    expect(wrapper.vm.amount).toBe('$ 2,000.34');
  })

  it('format values with decimals even when no decimal specified', () => {
    const wrapper = shallowMount(VueNumeric, { propsData: { modelValue: 2000, precision: 2, currency: '$' }})
    expect(wrapper.vm.amount).toBe('$ 2,000.00');
  })

  it('format values with decimals rounded', () => {
    const wrapper = shallowMount(VueNumeric, { propsData: { modelValue: 2000.36, precision: 1, currency: '$' }})
    expect(wrapper.vm.amount).toBe('$ 2,000.4');
  })

  it('format values with . separator', () => {
    const wrapper = shallowMount(VueNumeric, { propsData: { modelValue: 2000000, currency: '$', separator: '.', precision: 2 }})
    expect(wrapper.vm.amount).toBe('$ 2.000.000,00');
  })

  it('format values with , separator', () => {
    const wrapper = shallowMount(VueNumeric, { propsData: { modelValue: 2000000, currency: '$', separator: ',', precision: 2 }})
    expect(wrapper.vm.amount).toBe('$ 2,000,000.00');
  })

  it('format values with space separator', () => {
    const wrapper = shallowMount(VueNumeric, { propsData: { modelValue: 2000000, currency: '$', separator: 'space', precision: 2  }})
    expect(wrapper.vm.amount).toBe('$ 2 000 000,00');
  })

  it(
    'format values with correct decimals symbol when using different thousand separator',
    () => {
      const wrapper = shallowMount(VueNumeric, { propsData: { modelValue: 20000.36, precision: 1, currency: '$', separator: '.' }})
      expect(wrapper.vm.amount).toBe('$ 20.000,4');
    }
  )

  it('outputs Number type by default', () => {
    const component = ({
      data: () => ({ total: 100 }),
      template: '<div><vue-numeric :modelValue="total" :min="1" :max="100"></vue-numeric></div>',
      components: { VueNumeric }
    })

    const wrapper = mount(component)
    expect(typeof wrapper.vm.total).toBe('number');
  })

  it('outputs String if specified', () => {
    const component = ({
        data: () => ({ total: 100 }),
        template: '<div><vue-numeric :modelValue="total" outputType="String" :min="1" :max="100"></vue-numeric></div>',
        components: { VueNumeric }
    })

    const wrapper = mount(component);
    expect(typeof wrapper.vm.total).toBe('string');
  })

  it('is <span> tag in read-only mode', () => {
    const wrapper = shallowMount(VueNumeric, { propsData: { modelValue: 2000, currency: '$', readOnly: true, readOnlyClass: 'test-class' }})
    expect(wrapper.find('span').exists()).toBe(true);
    expect(wrapper.find('span').classes()).toContain('test-class');
    expect(wrapper.vm.amount).toBe('$ 2,000');
  })

  it('apply class when read-only mode enabled', async done => {
    const propsData = { modelValue: 3000, readOnly: false, readOnlyClass: 'testclass' }
    const wrapper = shallowMount(VueNumeric, { propsData })

    await wrapper.setProps({ readOnly: true })

    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.$el.className).toBe('testclass');
      done()
    })
  })

  it('does not apply class when read-only mode disabled', async done => {
    const propsData = { modelValue: 3000, readOnly: true, readOnlyClass: 'testclass' }
    const wrapper = shallowMount(VueNumeric, { propsData })

    await wrapper.setProps({ readOnly: false })
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.$el.className).toBe('');
      done()
    })
  })

  it('cannot exceed max props', async () => {
    const component = ({
      data: () => ({ total: 150 }),
      template: '<div><vue-numeric :modelValue="total" :max="100"></vue-numeric></div>',
      components: { VueNumeric }
    })
    const wrapper = mount(component);
    expect(wrapper.vm.total).toBe(100);
  })

  it('cannot below min props', () => {
    const component = ({
      data: () => ({ total: 150 }),
      template: '<div><vue-numeric :modelValue="total" :min="200"></vue-numeric></div>',
      components: { VueNumeric }
    })
    
    const wrapper = mount(component);
    expect(wrapper.vm.total).toBe(200);
  })

  it('process valid value ', () => {
    const component = ({
      data: () => ({ total: 100 }),
      template: '<div><vue-numeric :modelValue="total" :min="10" :max="200"></vue-numeric></div>',
      components: { VueNumeric }
    })

    const wrapper = mount(component);
    expect(wrapper.vm.total).toBe(100);
  })

  it('allow minus value when minus props is true', () => {
    const component = ({
      data: () => ({ total: -150 }),
      template: '<div><vue-numeric :modelValue="total" :min="-150" :minus="true"></vue-numeric></div>',
      components: { VueNumeric }
    })

    const wrapper = mount(component);
    expect(wrapper.vm.total).toBe(-150);
  })

  it('disallow minus value when minus props is false', () => {
    const component = ({
      data: () => ({ total: -150 }),
      template: '<div><vue-numeric :modelValue="total" :min="-150" :minus="false"></vue-numeric></div>',
      components: { VueNumeric }
    })

    const wrapper = mount(component);
    expect(wrapper.vm.total).toBe(0);
  })

  it('updates delayed value with format if without focus', done => {
    const el = document.createElement('div')
    const wrapper = mount({
      el,
      data: () => ({ total: 0 }),
      template: '<div><vue-numeric :modelValue="total"></vue-numeric></div>',
      components: { VueNumeric }
    })

    setTimeout(() => {
      wrapper.vm.total = 3000
    }, 100);

    setTimeout(() => {
      expect(wrapper.element.firstChild.value.trim()).toBe('3,000');
      done()
    }, 500);
  })

  it('remove space if currency props undefined', () => {
    const wrapper = shallowMount(VueNumeric, {propsData: { modelValue: 2000 }})
    expect(wrapper.vm.amount).toBe('2,000');
  })

  it('format value on blur', () => {
    const wrapper = shallowMount(VueNumeric, {propsData: { modelValue: 2000 }})
    wrapper.trigger('blur')
    expect(wrapper.vm.amount).toBe('2,000');
  })

  it('clear the field if zero value', () => {
    const wrapper = shallowMount(VueNumeric, {propsData: { modelValue: 0, separator: '.', precision: 2 }})
    wrapper.trigger('focus')
    expect(wrapper.vm.amount).toBe(null);
  })

  it('remove thousand separator and symbol on focus with , decimal', () => {
    const wrapper = shallowMount(VueNumeric, {propsData: { modelValue: 2000.21, separator: '.', precision: 2 }})
    wrapper.trigger('focus')
    expect(wrapper.vm.amount).toBe('2000,21');
  })

  it('remove thousand separator and symbol on focus with . decimal', () => {
    const wrapper = shallowMount(VueNumeric, {propsData: { modelValue: 2000.21, separator: ',', precision: 2 }})
    wrapper.trigger('focus')
    expect(wrapper.vm.amount).toBe('2000.21');
  })

  it('process value on input', () => {
    const wrapper = shallowMount(VueNumeric, { propsData: { modelValue: 2000 }, methods: { process }})
    wrapper.trigger('input')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
  })

  it('does not show default value when placeholder if defined', () => {
    const wrapper = shallowMount(VueNumeric, { propsData: { modelValue: 2000, placeholder: 'number here' }})
    expect(wrapper.vm.amount).toBe('');
  })

  it(
    'sets the value to 0 when no empty value is provided and input is empty',
    () => {
      const wrapper = shallowMount(VueNumeric, { propsData: { modelValue: '' }})
      expect(wrapper.vm.amount).toBe('0');
    }
  )

  it('uses the provided empty value when input is empty', () => {
    const wrapper = shallowMount(VueNumeric, { propsData: { modelValue: '', emptyValue: 1 }})
    expect(wrapper.vm.amount).toBe('1');
  })

  it(
    'apply min props value if user input negative value when minus props disabled',
    () => {
      const component = ({
        data: () => ({ total: -200 }),
        template: '<div><vue-numeric :modelValue="total" :min="150" :minus="false"></vue-numeric></div>',
        components: { VueNumeric }
      })

      const wrapper = mount(component);
      expect(wrapper.vm.total).toBe(150);
    }
  )

  it(
    'apply 0 value if user input negative value when minus props disabled and min props is negative too',
    async () => {
      const component = ({
        data: () => { return {total: -200 } },
        template: '<div><vue-numeric :modelValue="total" :min="-150" :minus="false"></vue-numeric></div>',
        components: { VueNumeric }
      })

      const wrapper = mount(component);
      await wrapper.setData({ total : -200});
      expect(wrapper.element).toBe(0);
    }
  )

  it('apply new separator immediately if it is changed', async () => {
    const wrapper = shallowMount(VueNumeric, { propsData: { modelValue: 2000, separator: ',' }})
    await wrapper.setProps({ separator: '.' })
    expect(wrapper.vm.amount).toBe('2.000');
  })

  it('apply new currency prop immediately if it is changed', async () => {
    const wrapper = shallowMount(VueNumeric, { propsData: { modelValue: 0, currency: '$' }})
    await wrapper.setProps({ currency: 'USD' })
    expect(wrapper.vm.amount).toBe('USD 0');
  })

  it('apply new precision immediately if it is changed', async () => {
    const wrapper = shallowMount(VueNumeric, { propsData: { modelValue: 2000.17, precision: 2 }})
    await wrapper.setProps({ precision: 1 })
    expect(wrapper.vm.amount).toBe('2,000.2');
  })

  it('allow to use arbitrary separators', () => {
    const wrapper = shallowMount(VueNumeric, {
      propsData: {
        modelValue: 1000.94 ,
        precision: 2,
        thousandSeparator: ' ',
        decimalSeparator: ','
      }
    })
    expect(wrapper.vm.amount).toBe('1 000,94');
  })
})
