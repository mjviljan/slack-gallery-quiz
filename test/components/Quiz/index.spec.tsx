import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Quiz } from '../../../src/components/Quiz'
import { QuizUser } from '../../../src/types/types'

describe('Quiz', () => {
    const fakeImage =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAYAAAAfrhY5AAAACXBIWXMAAC4jAAAuIwF4pT92AAABCUlEQVRIx82XSxbCIAxFXzK3W5KVyWFnrIkNxIHiobbVJKQembSD8u5NP6GQiGBJGa0WPIcsKROCR6tFlpSp1fLi0eV6W4H7SaRAq2WV2wVIRDbgSIER/C7Q4XI0eUZgDzzmkgylRwp8AvfBmmBNkPX6JWVibWVaAS0YANhya78FW8Ar+KyAFbyBewU84F24VcALBvDocFFvubUQjv6+LfP5jAajncdRQZ7rOTrQIqqGR3Y4E/yM3q6Cez831ap2Blg7n6MWCU8Oz4JnBDiiYq8AR91qjwBHPmOrAEe+XFaB//57PWtV6//tfe/0sx0LAOqV47l3omjwQU7vD+Bx12hpHB6B4YhWC+5wreSRpWw7DAAAAABJRU5ErkJggg=='

    test('renders without errors (with a single user)', async () => {
        const testUsers: QuizUser[] = [
            {
                id: 'USER1',
                imageUrl: fakeImage,
                nickname: 'nick',
                firstName: 'First',
            },
        ]
        render(<Quiz users={testUsers} />)
        const placeholder = screen.getByAltText("Hidden placeholder for doggo's picture")
        // the "onLoad" event doesn't fire in the test, so we have to trigger it manually
        if (placeholder) fireEvent.load(placeholder)

        const image = await screen.findByAltText('Picture of a doggo')
        expect(image).toBeVisible()
    })
})
