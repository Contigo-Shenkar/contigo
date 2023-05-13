import React from 'react'
import { Button as AntdButton } from 'antd'
export default function Button(props) {
    return (
        <div className='bg-blueLight rounded-lg overflow-hidden text-white hover:opacity-95'>
            <AntdButton className='w-full xl:min-h-[50px] lg:min-h-[40px] text-white hover:text-inherit' htmlType={props.htmlType} onClick={props.onClick} loading={props.loading}>{props.children}</AntdButton>
        </div>
    )
}
