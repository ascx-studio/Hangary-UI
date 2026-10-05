import { cn } from "cn";
import type { ComponentProps } from "react";


const Ellipses = () => {
	const sharedClasses =
		"rounded-full outline outline-8 sm:my-6 md:my-8 size-1 my-4 outline-background bg-foreground";
	return (
		<div className="absolute z-0 grid h-full w-full items-center gap-8 lg:grid-cols-2">
			<div className="absolute z-0 grid h-full w-full grid-cols-2 place-content-between">
				<div className={`${sharedClasses} mx-[-2.5px]`}></div>
				<div className={`${sharedClasses} -mx-0.5 place-self-end`}></div>
				<div className={`${sharedClasses} mx-[-2.5px]`}></div>
				<div className={`${sharedClasses} -mx-0.5 place-self-end`}></div>
			</div>
		</div>
	);
};

export const Container = ({ children, className, ...props }: ComponentProps<"div">) => (
    <div {...props} className={cn("relative min-w-0 w-full rounded-lg border px-4 sm:px-6 md:px-8", className)}>
        <div className="absolute left-0 top-4 z-0 h-px w-full bg-border sm:top-6 md:top-8"></div>
        <div className="absolute bottom-4 left-0 z-0 h-px w-full bg-border sm:bottom-6 md:bottom-8"></div>
        <div className="relative min-w-0 w-full border-x">
            <Ellipses />
            <div className="relative z-10 flex min-h-0 min-w-0 w-full flex-col py-8">{children}</div>
        </div>
    </div>
);
