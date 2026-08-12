import fs from 'fs'
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import { generateMeetingPaper } from '../src/utils/meetingPaperGenerator'
import { mindefSgResearch } from '../src/data/research/mindef-sg'
import { companies } from '../src/data/companies'
import { people } from '../src/data/people'
import { stripEmptyListParagraphs } from '../src/utils/templateExport'

const person = people.find((p) => p.id === 'chan-chun-sing')
const company = companies.find((c) => c.id === 'mindef-sg')
if (!person || !company) throw new Error('missing fixture')
const research = mindefSgResearch['chan-chun-sing']
const paper = generateMeetingPaper(research, company, person, 'Singapore Airshow bilateral')

console.log('campaignBackground length:', paper.campaignBackground.length)
console.log('ends with ellipsis?', paper.campaignBackground.endsWith('…') || paper.campaignBackground.endsWith('...'))
console.log('contains Chinooks?', paper.campaignBackground.includes('Chinooks'))

function countEmptyNum(xml: string) {
  let emptyNum = 0
  let i = 0
  let guard = 0
  while (i < xml.length) {
    if (++guard > 100000) throw new Error('countEmptyNum infinite loop at i=' + i)
    const start = xml.indexOf('<w:p', i)
    if (start < 0) break
    const after = xml[start + 4]
    if (after !== '>' && after !== ' ' && after !== '\n' && after !== '\r' && after !== '\t') {
      i = start + 4
      continue
    }
    const end = xml.indexOf('</w:p>', start)
    if (end < 0) break
    const pXml = xml.slice(start, end)
    const hasNum = pXml.includes('<w:numPr')
    const pTexts: string[] = []
    let c = 0
    while (true) {
      const ts = pXml.indexOf('<w:t', c)
      if (ts < 0) break
      const g = pXml.indexOf('>', ts)
      const te = pXml.indexOf('</w:t>', g)
      if (te < 0) break
      pTexts.push(pXml.slice(g + 1, te))
      c = te + 6
    }
    if (hasNum && !pTexts.join('').trim()) emptyNum++
    i = end + 6
  }
  return emptyNum
}

function extractText(xml: string) {
  const texts: string[] = []
  let cursor = 0
  while (true) {
    const tStart = xml.indexOf('<w:t', cursor)
    if (tStart < 0) break
    const gt = xml.indexOf('>', tStart)
    if (gt < 0) break
    const tEnd = xml.indexOf('</w:t>', gt)
    if (tEnd < 0) break
    texts.push(xml.slice(gt + 1, tEnd))
    cursor = tEnd + 6
  }
  return texts.join('')
}

function check(path: string) {
  console.log('\n== starting', path, '==')
  const t0 = Date.now()
  const buf = fs.readFileSync(path)
  const zip = new PizZip(buf)
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    delimiters: { start: '{{', end: '}}' },
  })
  const keyMessages = paper.keyMessages.map((km) =>
    km.note ? `${km.message}\nNote: ${km.note}` : km.message,
  )
  console.log('rendering...', Date.now() - t0)
  doc.render({
    date_label: paper.dateLabel,
    meeting_title: paper.meetingTitle.replace(/^MEETING WITH\s+/i, 'Meeting With '),
    subtitle: paper.subtitle,
    location_or_event: paper.locationOrEvent,
    contact: `${paper.contact.name}, ${paper.contact.title}, ${paper.contact.phone}`,
    customer_lines: [
      `${paper.customer.name}, ${paper.customer.title}`,
      `"${paper.customer.salutation}" [${paper.customer.phonetic}]`,
      `RAA: "${paper.customer.raa}"`,
    ],
    objectives: paper.objectives.filter((o) => o.trim()),
    key_messages: keyMessages.filter((m) => m.trim()),
    campaign_background: paper.campaignBackground,
    cust_sat: paper.customerSatIssues.filter((s) => s.trim()),
    engagement_background: paper.engagementBackground,
    biography: `${paper.biography.name}, ${paper.biography.title}\n${paper.biography.text}`,
    agenda: paper.agendaLogistics || '',
  })
  console.log('render done', Date.now() - t0)
  const outZip = doc.getZip()
  stripEmptyListParagraphs(outZip)
  console.log('strip done', Date.now() - t0)
  const xmlFile = outZip.file('word/document.xml')
  if (!xmlFile) throw new Error('no document.xml')
  const xml = xmlFile.asText()
  console.log('xml length', xml.length)
  const full = extractText(xml)
  const emptyNum = countEmptyNum(xml)
  console.log({
    emptyNum,
    hasChinooks: full.includes('Chinooks'),
    hasEllipsisCut: /Chinoo…|Chinoo\.\.\./.test(full),
    hasFullOverviewEnd: full.includes('annual buys'),
    hasBilateral: full.includes('US-Singapore defence relationship'),
    hasRAA: full.includes('Responsible for defence'),
    hasObj: full.includes('follow-on technical session'),
    hasKeyMsg: full.includes('P-8A delivery'),
    leftoverPlaceholders: (full.match(/\{\{|\{#/g) || []).length,
    ms: Date.now() - t0,
  })
  fs.writeFileSync(
    `/tmp/sample-${path.includes('airshow') ? 'airshow' : 'std'}.docx`,
    outZip.generate({ type: 'nodebuffer' }),
  )
}

for (const p of [
  'public/templates/meeting-paper-airshow-fillable.docx',
  'public/templates/meeting-paper-fillable.docx',
]) {
  try {
    check(p)
  } catch (e: any) {
    console.error('FAIL', p, e.message)
    console.error(e.stack?.split('\n').slice(0, 20).join('\n'))
  }
}
