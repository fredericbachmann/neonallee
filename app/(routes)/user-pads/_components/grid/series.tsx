import { useState } from 'react'
import { UserPadsPad } from './pad'
import { _Series } from '../../types'
import { useDrop } from 'react-dnd'
import { HiFolder, HiOutlineXCircle } from 'react-icons/hi2'
import { Button, Modal } from '@mantine/core'
import { List, arrayMove } from 'react-movable'
import { serverEditSeries } from '../../_server-actions/update-series'

/** The representation of ONE series for the user-pads page */
export function UserPadsSeries({ series }: { series: _Series }) {
  const [showModal, setShowModal] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'pad',
    drop: () => ({ id: series.id }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  const padsForEditing = series.pads
    .filter((pad) => pad.pad !== undefined)
    .map((pad) => pad.pad!)

  return (
    <>
      <button onClick={() => setShowModal(true)} ref={drop}>
        <HiFolder className='h-96 w-96' />
      </button>

      <Modal
        size='7xl'
        opened={showModal}
        onClose={() => setShowModal(false)}
        title={
          <div className='flex items-center gap-5'>
            <p>{series.name}</p>
            {series.isOwner && (
              <Button
                variant={showEdit ? '' : 'outline'}
                onClick={() => setShowEdit(!showEdit)}
              >
                Bearbeiten
              </Button>
            )}
          </div>
        }
      >
        {showEdit ? (
          <EditSeries pads={padsForEditing} seriesId={series.id} />
        ) : (
          <div className='flex flex-wrap justify-center'>
            {series.pads.map((pad, index) =>
              pad.pad ? (
                <UserPadsPad
                  pad={{ ...pad.pad, seriesName: series.name }}
                  key={index}
                />
              ) : (
                <p key={index}>x</p>
              )
            )}
          </div>
        )}
      </Modal>
    </>
  )
}

function EditSeries({
  pads: padsProp,
  seriesId,
}: {
  pads: {
    id: string
    name: string
  }[]
  seriesId: string
}) {
  const [pads, setPads] = useState(padsProp)

  return (
    <>
      <List
        transitionDuration={0}
        values={pads}
        onChange={({ oldIndex, newIndex }) =>
          setPads(arrayMove(pads, oldIndex, newIndex))
        }
        renderList={({ children, props }) => <div {...props}>{children}</div>}
        renderItem={({ value, props, index }) => (
          <div className='flex items-center m-2' key={index}>
            {/* TODO: change the format to a grid with static displayed indexes */}
            <p className='text-xl w-8'>
              {typeof index !== 'undefined' && index + 1}
            </p>
            <div
              {...props}
              key={value.id}
              className='flex-1 flex items-center p-3 border-2 rounded-lg border-gray-500 z-50'
            >
              <p className='flex-1'>{value.name}</p>
              <button
                onClick={(e) => {
                  setPads(pads.filter((pad) => pad !== value))
                }}
              >
                <HiOutlineXCircle className='h-8 w-8' />
              </button>
            </div>
          </div>
        )}
      />
      <Button
        onClick={() =>
          serverEditSeries(
            seriesId,
            pads.map((pad, index) => {
              return { padId: pad.id, indexInSeries: index }
            })
          )
        }
        variant='outline'
        color='green'
        className='m-3'
      >
        Änderungen speichern
      </Button>
    </>
  )
}
