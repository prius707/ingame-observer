import '@fontsource/work-sans/latin-500.css'
import '@fontsource/work-sans/latin-600.css'
import {
  RiAwardLine,
  RiCalendarEventLine,
  RiGamepadLine,
  RiSwordLine,
} from '@remixicon/react'
import { StatCards, type Stat } from '@/boardui/components/application/dashboard/stat-cards'
import { Chip } from '@/boardui/components/base/badges/chip'
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@/boardui/components/base/table/table'
import { DirectionProvider } from '@/boardui/components/foundations/direction/direction'
import '@/boardui/styles/globals.css'
import { EVENT_YEARS, type EventYear } from './events'

type EventRow = {
  id: string
  year: number
  name: string
  game: 'VALORANT' | 'CS'
  emmy: 'winner' | 'nominated'
  emmyAwardYear?: number
}

function flatten(groups: EventYear[]) {
  return groups.flatMap((group) =>
    group.events.map((event) => ({ year: group.year, event })),
  )
}

function shareLabel(part: number, whole: number): string {
  if (whole <= 0) return '0%'
  return `${Math.round((part / whole) * 100)}%`
}

function summarize(groups: EventYear[]) {
  const rows = flatten(groups)
  const career = flatten(EVENT_YEARS).length
  const valorant = rows.filter(({ event }) => event.game === 'VALORANT').length
  const cs = rows.filter(({ event }) => event.game === 'CS').length
  const emmy = rows.filter(({ event }) => event.emmy).length
  const wins = rows.filter(({ event }) => event.emmy === 'winner').length
  const emmyRows: EventRow[] = rows
    .filter(({ event }) => event.emmy)
    .map(({ year, event }) => ({
      id: `${year}-${event.name}`,
      year,
      name: event.name,
      game: event.game,
      emmy: event.emmy === 'winner' ? 'winner' : 'nominated',
      emmyAwardYear: event.emmyAwardYear,
    }))
  return {
    total: rows.length,
    career,
    valorant,
    cs,
    emmy,
    wins,
    emmyRows,
  }
}

export function EventBoardUi({ groups }: { groups: EventYear[] }) {
  const summary = summarize(groups)
  const stats: Stat[] = [
    {
      icon: RiCalendarEventLine,
      label: 'Events in this cut',
      value: String(summary.total),
      delta: `${summary.career} career`,
      deltaColor: 'neutral',
    },
    {
      icon: RiGamepadLine,
      label: 'VALORANT',
      value: String(summary.valorant),
      delta: shareLabel(summary.valorant, summary.total),
      deltaColor: 'lime',
    },
    {
      icon: RiSwordLine,
      label: 'Counter-Strike',
      value: String(summary.cs),
      delta: shareLabel(summary.cs, summary.total),
      deltaColor: 'neutral',
    },
    {
      icon: RiAwardLine,
      label: 'Sports Emmy',
      value: String(summary.emmy),
      delta: summary.wins === 1 ? '1 win' : `${summary.wins} wins`,
      deltaColor: summary.wins > 0 ? 'lime' : 'neutral',
    },
  ]

  return (
    <section className="events-boardui" aria-label="Events summary">
      <p className="events-boardui__note">
        BoardUI preview · counts follow the filters above
      </p>
      <div className="boardui dark">
        <DirectionProvider locale="en-US">
          <StatCards variant="plain" stats={stats} columns={2} />
          {summary.emmyRows.length > 0 ? (
            <div className="mt-4 overflow-hidden rounded-2xl bg-background-secondary-default">
              <p className="px-4 pt-3 pb-1 text-body-medium text-text-secondary">
                Sports Emmy in this cut
              </p>
              <Table aria-label="Sports Emmy events in this cut" size="sm">
                <TableHeader>
                  <TableColumn id="year" isRowHeader>
                    Year
                  </TableColumn>
                  <TableColumn id="event">Event</TableColumn>
                  <TableColumn id="game">Game</TableColumn>
                  <TableColumn id="result">Result</TableColumn>
                </TableHeader>
                <TableBody>
                  {summary.emmyRows.map((row) => (
                    <TableRow key={row.id} id={row.id}>
                      <TableCell>
                        {row.emmyAwardYear && row.emmyAwardYear !== row.year
                          ? `${row.year} · awarded ${row.emmyAwardYear}`
                          : row.year}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>
                        <Chip
                          variant="caption"
                          color={row.game === 'VALORANT' ? 'purple' : 'orange'}
                        >
                          {row.game === 'CS' ? 'Counter-Strike' : 'VALORANT'}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Chip
                          variant="bold"
                          color={row.emmy === 'winner' ? 'lime' : 'yellow'}
                        >
                          {row.emmy === 'winner' ? 'Winner' : 'Nominated'}
                        </Chip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null}
        </DirectionProvider>
      </div>
    </section>
  )
}
