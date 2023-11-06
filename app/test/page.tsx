'use client'
import { List, arrayMove } from 'react-movable';
import { useState } from "react"
import { Modal } from 'flowbite-react';

export default function Page() {
    const [items, setItems] = useState([
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
        'Item 5',
        'Item 6'
    ]);

    return (
        <Modal show>
            <Modal.Body>

                <List
                    values={items}
                    onChange={({ oldIndex, newIndex }) =>
                        setItems(arrayMove(items, oldIndex, newIndex))
                    }
                    renderList={({ children, props, isDragged }) => (
                        <ul
                            {...props}
                            style={{ padding: 0, cursor: isDragged ? 'grabbing' : undefined }}
                        >
                            {children}
                        </ul>
                    )}
                    renderItem={({ value, props, isDragged, isSelected }) => (
                        <li
                            {...props}
                            style={{
                                ...props.style,
                                padding: '1.5em',
                                margin: '0.5em 0em',
                                cursor: isDragged ? 'grabbing' : 'grab',
                              }}
                              className='z-50'
                        >
                            {value}
                        </li>
                    )}
                />
            </Modal.Body>
        </Modal>
    );
}