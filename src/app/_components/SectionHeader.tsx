import React from 'react'

export const SectionHeader = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  return (
    <div className='text-right'>
        <h2 className="mb-3 text-4xl font-medium text-violet-300 text-shadow-[0_0_40px_color-mix(in_oklab,var(--color-accent)_65%,transparent)] ">
            {children}
        </h2>
        <hr className='mb-5 w-20 text-violet-300 border-2 rounded-l-full ml-auto' />
    </div>
  )
}
