const initialPerf = performance.now()
import { getEventsFromICS } from './utils/ics'
import jsonToFrontmatter from './utils/jsonToFrontmatter'
import { parseArgs } from 'util'
import { argsSchema } from "./utils/types/schema";
import removeLastSlash from "./utils/removeLastSlash";
import getAverage from './utils/getAverage';

const { values } = parseArgs({
    args: Bun.argv,
    options: {
        out: {
            type: 'string'
        },
        ics: {
            type: 'string'
        }
    },
    strict: true,
    allowPositionals: true,
})

const parsedValues = argsSchema.safeParse(values)
if (!parsedValues.success) {
    console.error(parsedValues.error)
    process.exit(1)
}

const file = Bun.file(parsedValues.data.ics)

const parsed = getEventsFromICS(await file.text())

const events = parsed.map(event => {
    const [ics, uid, date, type] = event.id!.split('::')
    return {
        fileName: `${date} ${event.title.trim()}.md`,
        frontmatterContent: jsonToFrontmatter(event)
    }
})

const writePerfArray: number[] = []
for (const event of events) {
    if (writePerfArray.length > 0) {
        process.stdout.moveCursor(0, -1) // up one line
        process.stdout.clearLine(1)
    }
    console.log(`[#${writePerfArray.length + 1}] Writing ${event.fileName}`)

    const initialWritePerf = performance.now()

    await Bun.write(`${removeLastSlash(parsedValues.data.out)}/${event.fileName}`, event.frontmatterContent)

    const finalWritePerf = performance.now()
    writePerfArray.push(finalWritePerf - initialWritePerf)
}

const finalPerf = performance.now()

console.log(`[DONE] Finished in ${(finalPerf - initialPerf).toFixed(2)}ms`)
console.log(`[DONE] Average write time: ${(getAverage(writePerfArray) * 1000).toFixed(2)}µs`)