import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { test } from 'node:test';

const script = readFileSync(new URL('../Assets/WebGLTemplates/Clearcut/pointer-lock.js', import.meta.url), 'utf8');

function setup(requestPointerLock, hasFocus = true) {
  const canvas = new EventTarget();
  const doc = new EventTarget();
  const notices = [];
  let focusCount = 0;
  canvas.focus = () => focusCount++;
  canvas.requestPointerLock = requestPointerLock;
  doc.getElementById = () => canvas;
  doc.hasFocus = () => hasFocus;
  doc.pointerLockElement = null;
  doc.exitPointerLock = () => { doc.pointerLockElement = null; };
  const window = { clearcutUnity: { SendMessage: (...args) => notices.push(args) } };
  runInNewContext(script, { window, document: doc });
  const click = () => {
    const event = new Event('pointerdown');
    Object.defineProperty(event, 'button', { value: 0 });
    canvas.dispatchEvent(event);
  };
  return { pointer: window.clearcutPointer, doc, canvas, click, notices, focusCount: () => focusCount };
}

test('a rejected capture falls back once and keeps canvas keyboard focus', async () => {
  const bridge = setup(() => Promise.reject(new Error('WrongDocumentError')));
  bridge.pointer.arm(true);
  bridge.click();
  await Promise.resolve();
  bridge.doc.dispatchEvent(new Event('pointerlockerror'));
  assert.deepEqual(bridge.notices, [['Field operator', 'OnWebPointerLockDenied']]);
  assert.equal(bridge.focusCount(), 1);
  assert.equal(bridge.pointer.locked(), false);
});

test('unfocused documents do not request pointer capture', () => {
  const bridge = setup(() => { assert.fail('Browser API should not receive this attempt'); }, false);
  bridge.pointer.arm(true);
  bridge.click();
  assert.equal(bridge.notices.length, 1);
});

test('releasing a successful capture allows a later retry', () => {
  let bridge;
  bridge = setup(() => { bridge.doc.pointerLockElement = bridge.canvas; });
  bridge.pointer.arm(true);
  bridge.click();
  assert.equal(bridge.pointer.locked(), true);
  bridge.doc.dispatchEvent(new Event('pointerlockchange'));
  bridge.pointer.arm(false);
  assert.equal(bridge.pointer.locked(), false);
  bridge.pointer.arm(true);
  bridge.click();
  assert.equal(bridge.pointer.locked(), true);
  assert.equal(bridge.notices.length, 0);
});
