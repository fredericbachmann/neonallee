'use client'
import { List, arrayMove } from 'react-movable';
import { useState } from "react"
import { Modal } from 'flowbite-react';
import { DndProvider, useDrag } from 'react-dnd';
import { HiMoon } from 'react-icons/hi';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function Page() {

    return (
        <DndProvider backend={HTML5Backend}>
            <Dnd />
        </DndProvider>
    )
}

function Dnd() {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'x',
        end(item, monitor) {
            console.log('end')
            const dropResult = monitor.getDropResult<{ id: string }>()
            if (item && dropResult) {
                console.log('moved------------------------')
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            handlerId: monitor.getHandlerId(),
        }),
    }))

    return <div ref={drag} style={{
        opacity: isDragging ? 0.5 : 1,
        fontSize: 25,
        fontWeight: 'bold',
        cursor: 'move',
      }}>
        <HiMoon className='h-40 w-40' />
    </div>
}