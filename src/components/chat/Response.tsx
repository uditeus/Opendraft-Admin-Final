"use client"

import { memo, type ComponentProps } from "react"
import { Streamdown } from "streamdown"

import { cn } from "@/lib/utils"

type ResponseProps = ComponentProps<typeof Streamdown>

export const Response = memo(
    ({ className, ...props }: ResponseProps) => (
        <Streamdown
            className={cn(
                "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_ul]:pl-10 [&_ol]:pl-10 [&_ul]:my-6 [&_ol]:my-6 [&_li]:mt-3",
                className
            )}
            {...props}
        />
    ),
    (prevProps, nextProps) => prevProps.children === nextProps.children
)

Response.displayName = "Response"
