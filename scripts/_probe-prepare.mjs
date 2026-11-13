import { prepareNapcat } from '../plugin/index.js'
const dir = 'D:\\DSH\\workplace\\dafeiyu\\ruanjian'
try {
  const r = await prepareNapcat({
    profileRoot: 'C:\\Users\\Administrator\\.dsh\\profiles\\desktop',
    napcatDir: dir,
    adminUser: '1503535905',
    botQQ: '',
    launch: false,
    onProgress: (t) => console.log('[progress]', t),
  })
  console.log('ok=', r.ok)
  for (const s of r.steps) console.log(s.status, '|', s.text)
} catch (error) {
  console.log('THREW:', error?.message)
  console.log((error?.stack ?? '').split('\n').slice(0, 6).join('\n'))
}
