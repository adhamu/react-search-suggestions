import React from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import SearchSuggestions from '../SearchSuggestions'
import * as getElementText from '../getElementText'

const suggestions = ['reddit', 'facebook', 'twitter'].map(word => (
  <a key={word} href={`https://${word}.com`}>
    {word}
  </a>
))

describe('SearchSuggestions', () => {
  const mockGetElementText = jest.spyOn(getElementText, 'getElementText')

  beforeEach(jest.clearAllMocks)

  describe('renders correctly with default options', () => {
    beforeEach(() => {
      render(<SearchSuggestions suggestions={suggestions} />)
    })

    it('has the correct type', () => {
      expect(screen.getByRole('searchbox')).toHaveAttribute('type', 'search')
    })

    it('sets spellCheck off', () => {
      expect(screen.getByRole('searchbox')).toHaveAttribute(
        'spellcheck',
        'false'
      )
    })

    it('sets autoCapitalize off', () => {
      expect(screen.getByRole('searchbox')).toHaveAttribute(
        'autoCapitalize',
        'off'
      )
    })

    it('sets autoComplete off', () => {
      expect(screen.getByRole('searchbox')).toHaveAttribute(
        'autoComplete',
        'off'
      )
    })

    it('sets the name attribute', () => {
      expect(screen.getByRole('searchbox')).toHaveAttribute('name', 'q')
    })

    it('sets the placeholder attribute', () => {
      expect(screen.getByRole('searchbox')).toHaveAttribute(
        'placeholder',
        'Search'
      )
    })

    it('does not set autoFocus', () => {
      expect(screen.getByRole('searchbox')).not.toHaveFocus()
    })

    it('does not show suggestions if no input has been entered', () => {
      expect(screen.queryByRole('list')).not.toBeInTheDocument()
    })
  })

  describe('renders correctly with custom options', () => {
    it('sets the name attribute', () => {
      render(<SearchSuggestions suggestions={suggestions} name="search" />)

      expect(screen.getByRole('searchbox')).toHaveAttribute('name', 'search')
    })

    it('sets the placeholder attribute', () => {
      render(
        <SearchSuggestions
          suggestions={suggestions}
          placeholder="Enter keywords"
        />
      )

      expect(screen.getByRole('searchbox')).toHaveAttribute(
        'placeholder',
        'Enter keywords'
      )
    })

    it('sets autoFocus', () => {
      render(<SearchSuggestions suggestions={suggestions} autoFocus />)

      expect(screen.getByRole('searchbox')).toHaveFocus()
    })

    it('sets an ID', () => {
      const { container } = render(
        <SearchSuggestions suggestions={suggestions} id="react-search" />
      )

      // eslint-disable-next-line testing-library/no-node-access
      expect(container.firstChild).toHaveAttribute('id', 'react-search')
    })

    it('sets a className', () => {
      const { container } = render(
        <SearchSuggestions suggestions={suggestions} className="react-search" />
      )

      // eslint-disable-next-line testing-library/no-node-access
      expect(container.firstChild).toHaveClass('react-search')
    })
  })

  it('fires an onChange event if provided', () => {
    const mockOnChange = jest.fn()

    render(
      <SearchSuggestions suggestions={suggestions} onChange={mockOnChange} />
    )

    expect(mockOnChange).not.toHaveBeenCalled()

    userEvent.type(screen.getByRole('searchbox'), 't')

    expect(mockOnChange).toHaveBeenCalled()
    expect(mockGetElementText).toHaveBeenCalled()
  })

  it('shows filtered search suggestions based on input entered', () => {
    render(<SearchSuggestions suggestions={suggestions} />)

    expect(screen.queryByRole('list')).not.toBeInTheDocument()

    userEvent.type(screen.getByRole('searchbox'), 't')

    expect(screen.getByRole('list')).toBeInTheDocument()

    expect(screen.getByRole('link', { name: 'reddit' })).toHaveAttribute(
      'href',
      'https://reddit.com'
    )

    expect(screen.getByRole('link', { name: 'twitter' })).toHaveAttribute(
      'href',
      'https://twitter.com'
    )

    expect(
      screen.queryByRole('link', { name: 'facebook' })
    ).not.toBeInTheDocument()
  })
})