import { Slug } from './slug'

it('should be abe to create a new slug from text', () => {
  const slug = Slug.createFromText('Exemple question title')
  expect(slug.value).toEqual('exemple-question-title')
})

it('should be able to normalize text', () => {
  const slug = Slug.createFromText('Texto sem noção')
  expect(slug.value).toEqual('texto-sem-nocao')
})

it('should be able to remove non textual chars', () => {
  const slug = Slug.createFromText("Meu 1 texto #let's go")
  expect(slug.value).toEqual('meu-1-texto-lets-go')
})

it('should be able to remove white spaces when necessary', () => {
  const slug = Slug.createFromText('  texto  com  muito  espaço  ')
  expect(slug.value).toEqual('texto-com-muito-espaco')
})

it('should lowercase everything', () => {
  const slug = Slug.createFromText('TEXTO-UPPER')
  expect(slug.value).toEqual('texto-upper')
})
