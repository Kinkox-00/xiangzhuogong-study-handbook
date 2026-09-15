import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { test } from 'node:test'
import { courses, coursePath, chapterPath, findCourse } from '../docs/.vitepress/courses.mjs'

const docs = new URL('../docs/', import.meta.url)

test('course identifiers and chapter routes are unique', () => {
  assert.equal(new Set(courses.map(({ id }) => id)).size, courses.length)
  const paths = courses.flatMap((course) => course.chapters.map((chapter) => chapterPath(course, chapter)))
  assert.equal(new Set(paths).size, paths.length)
})

for (const course of courses) {
  test(`${course.id}: catalog entries have content and images`, () => {
    assert.match(course.id, /^[a-z0-9-]+$/)
    assert.ok(course.title && course.description && course.scope && course.imageAlt)
    assert.ok(course.chapters.length)
    assert.ok(existsSync(new URL(`courses/${course.id}/index.md`, docs)))
    assert.match(course.image, /^\/images\/[a-z0-9-]+\.png$/)
    assert.ok(existsSync(new URL(`public${course.image}`, docs)))
    assert.equal(findCourse(coursePath(course)), course)
    for (const chapter of course.chapters) {
      assert.match(chapter.slug, /^[a-z0-9-]+$/)
      assert.ok(chapter.title && chapter.description)
      assert.ok(existsSync(new URL(`.${chapterPath(course, chapter)}.md`, docs)), chapter.slug)
      assert.equal(findCourse(chapterPath(course, chapter)), course)
    }
    assert.equal(findCourse(`/courses/${course.id}-other/topic`), undefined)
  })
}

test('public pages do not inherit a course', () => {
  for (const path of ['/', '/about', '/feedback', '/courses/template/']) {
    assert.equal(findCourse(path), undefined)
  }
})
