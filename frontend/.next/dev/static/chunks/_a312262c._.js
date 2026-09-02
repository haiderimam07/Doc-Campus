(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$3$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tailwind-merge@3.3.0/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$3$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.59_react_4a6bd33c06d067053554ee20197f74c7/node_modules/next/dist/compiled/react-experimental/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$3_$40$types$2b$react$40$19$2e$1$2e$4_react$40$19$2e$1$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Slot$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-slot@1.2.3_@types+react@19.1.4_react@19.1.0/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript) <export * as Slot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
            destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
            secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-9 px-4 py-2 has-[>svg]:px-3",
            sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
            lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
            icon: "size-9"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$3_$40$types$2b$react$40$19$2e$1$2e$4_react$40$19$2e$1$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Slot$3e$__["Slot"].Slot : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/button.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
_c = Button;
;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/dropdown-menu.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DropdownMenu",
    ()=>DropdownMenu,
    "DropdownMenuCheckboxItem",
    ()=>DropdownMenuCheckboxItem,
    "DropdownMenuContent",
    ()=>DropdownMenuContent,
    "DropdownMenuGroup",
    ()=>DropdownMenuGroup,
    "DropdownMenuItem",
    ()=>DropdownMenuItem,
    "DropdownMenuLabel",
    ()=>DropdownMenuLabel,
    "DropdownMenuPortal",
    ()=>DropdownMenuPortal,
    "DropdownMenuRadioGroup",
    ()=>DropdownMenuRadioGroup,
    "DropdownMenuRadioItem",
    ()=>DropdownMenuRadioItem,
    "DropdownMenuSeparator",
    ()=>DropdownMenuSeparator,
    "DropdownMenuShortcut",
    ()=>DropdownMenuShortcut,
    "DropdownMenuSub",
    ()=>DropdownMenuSub,
    "DropdownMenuSubContent",
    ()=>DropdownMenuSubContent,
    "DropdownMenuSubTrigger",
    ()=>DropdownMenuSubTrigger,
    "DropdownMenuTrigger",
    ()=>DropdownMenuTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.59_react_4a6bd33c06d067053554ee20197f74c7/node_modules/next/dist/compiled/react-experimental/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$me_bbed7e8ab1c4b0af7a4bb2c961a1362d$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-dropdown-me_bbed7e8ab1c4b0af7a4bb2c961a1362d/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-client] (ecmascript) <export * as DropdownMenu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$511$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.511.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as CheckIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$511$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.511.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRightIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$511$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.511.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/circle.js [app-client] (ecmascript) <export default as CircleIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function DropdownMenu({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$me_bbed7e8ab1c4b0af7a4bb2c961a1362d$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].Root, {
        "data-slot": "dropdown-menu",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
_c = DropdownMenu;
function DropdownMenuPortal({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$me_bbed7e8ab1c4b0af7a4bb2c961a1362d$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].Portal, {
        "data-slot": "dropdown-menu-portal",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_c1 = DropdownMenuPortal;
function DropdownMenuTrigger({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$me_bbed7e8ab1c4b0af7a4bb2c961a1362d$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].Trigger, {
        "data-slot": "dropdown-menu-trigger",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_c2 = DropdownMenuTrigger;
function DropdownMenuContent({ className, sideOffset = 4, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$me_bbed7e8ab1c4b0af7a4bb2c961a1362d$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].Portal, {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$me_bbed7e8ab1c4b0af7a4bb2c961a1362d$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].Content, {
            "data-slot": "dropdown-menu-content",
            sideOffset: sideOffset,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md", className),
            ...props
        }, void 0, false, {
            fileName: "[project]/components/ui/dropdown-menu.tsx",
            lineNumber: 41,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
_c3 = DropdownMenuContent;
function DropdownMenuGroup({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$me_bbed7e8ab1c4b0af7a4bb2c961a1362d$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].Group, {
        "data-slot": "dropdown-menu-group",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_c4 = DropdownMenuGroup;
function DropdownMenuItem({ className, inset, variant = "default", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$me_bbed7e8ab1c4b0af7a4bb2c961a1362d$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].Item, {
        "data-slot": "dropdown-menu-item",
        "data-inset": inset,
        "data-variant": variant,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 72,
        columnNumber: 5
    }, this);
}
_c5 = DropdownMenuItem;
function DropdownMenuCheckboxItem({ className, children, checked, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$me_bbed7e8ab1c4b0af7a4bb2c961a1362d$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].CheckboxItem, {
        "data-slot": "dropdown-menu-checkbox-item",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        checked: checked,
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$me_bbed7e8ab1c4b0af7a4bb2c961a1362d$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].ItemIndicator, {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$511$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__["CheckIcon"], {
                        className: "size-4"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/dropdown-menu.tsx",
                        lineNumber: 103,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ui/dropdown-menu.tsx",
                    lineNumber: 102,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ui/dropdown-menu.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, this);
}
_c6 = DropdownMenuCheckboxItem;
function DropdownMenuRadioGroup({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$me_bbed7e8ab1c4b0af7a4bb2c961a1362d$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].RadioGroup, {
        "data-slot": "dropdown-menu-radio-group",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 115,
        columnNumber: 5
    }, this);
}
_c7 = DropdownMenuRadioGroup;
function DropdownMenuRadioItem({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$me_bbed7e8ab1c4b0af7a4bb2c961a1362d$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].RadioItem, {
        "data-slot": "dropdown-menu-radio-item",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$me_bbed7e8ab1c4b0af7a4bb2c961a1362d$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].ItemIndicator, {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$511$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleIcon$3e$__["CircleIcon"], {
                        className: "size-2 fill-current"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/dropdown-menu.tsx",
                        lineNumber: 138,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ui/dropdown-menu.tsx",
                    lineNumber: 137,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ui/dropdown-menu.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 128,
        columnNumber: 5
    }, this);
}
_c8 = DropdownMenuRadioItem;
function DropdownMenuLabel({ className, inset, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$me_bbed7e8ab1c4b0af7a4bb2c961a1362d$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].Label, {
        "data-slot": "dropdown-menu-label",
        "data-inset": inset,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-2 py-1.5 text-sm font-medium data-[inset]:pl-8", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 154,
        columnNumber: 5
    }, this);
}
_c9 = DropdownMenuLabel;
function DropdownMenuSeparator({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$me_bbed7e8ab1c4b0af7a4bb2c961a1362d$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].Separator, {
        "data-slot": "dropdown-menu-separator",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-border -mx-1 my-1 h-px", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 171,
        columnNumber: 5
    }, this);
}
_c10 = DropdownMenuSeparator;
function DropdownMenuShortcut({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        "data-slot": "dropdown-menu-shortcut",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground ml-auto text-xs tracking-widest", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 184,
        columnNumber: 5
    }, this);
}
_c11 = DropdownMenuShortcut;
function DropdownMenuSub({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$me_bbed7e8ab1c4b0af7a4bb2c961a1362d$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].Sub, {
        "data-slot": "dropdown-menu-sub",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 198,
        columnNumber: 10
    }, this);
}
_c12 = DropdownMenuSub;
function DropdownMenuSubTrigger({ className, inset, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$me_bbed7e8ab1c4b0af7a4bb2c961a1362d$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].SubTrigger, {
        "data-slot": "dropdown-menu-sub-trigger",
        "data-inset": inset,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$511$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__["ChevronRightIcon"], {
                className: "ml-auto size-4"
            }, void 0, false, {
                fileName: "[project]/components/ui/dropdown-menu.tsx",
                lineNumber: 220,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 210,
        columnNumber: 5
    }, this);
}
_c13 = DropdownMenuSubTrigger;
function DropdownMenuSubContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$me_bbed7e8ab1c4b0af7a4bb2c961a1362d$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__DropdownMenu$3e$__["DropdownMenu"].SubContent, {
        "data-slot": "dropdown-menu-sub-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dropdown-menu.tsx",
        lineNumber: 230,
        columnNumber: 5
    }, this);
}
_c14 = DropdownMenuSubContent;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14;
__turbopack_context__.k.register(_c, "DropdownMenu");
__turbopack_context__.k.register(_c1, "DropdownMenuPortal");
__turbopack_context__.k.register(_c2, "DropdownMenuTrigger");
__turbopack_context__.k.register(_c3, "DropdownMenuContent");
__turbopack_context__.k.register(_c4, "DropdownMenuGroup");
__turbopack_context__.k.register(_c5, "DropdownMenuItem");
__turbopack_context__.k.register(_c6, "DropdownMenuCheckboxItem");
__turbopack_context__.k.register(_c7, "DropdownMenuRadioGroup");
__turbopack_context__.k.register(_c8, "DropdownMenuRadioItem");
__turbopack_context__.k.register(_c9, "DropdownMenuLabel");
__turbopack_context__.k.register(_c10, "DropdownMenuSeparator");
__turbopack_context__.k.register(_c11, "DropdownMenuShortcut");
__turbopack_context__.k.register(_c12, "DropdownMenuSub");
__turbopack_context__.k.register(_c13, "DropdownMenuSubTrigger");
__turbopack_context__.k.register(_c14, "DropdownMenuSubContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/avatar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Avatar",
    ()=>Avatar,
    "AvatarFallback",
    ()=>AvatarFallback,
    "AvatarImage",
    ()=>AvatarImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.59_react_4a6bd33c06d067053554ee20197f74c7/node_modules/next/dist/compiled/react-experimental/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$avatar$40$1$2e$1$2e$_5a9974e12961f75199f51bebee75bca6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$avatar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Avatar$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-avatar@1.1._5a9974e12961f75199f51bebee75bca6/node_modules/@radix-ui/react-avatar/dist/index.mjs [app-client] (ecmascript) <export * as Avatar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
function Avatar({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$avatar$40$1$2e$1$2e$_5a9974e12961f75199f51bebee75bca6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$avatar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Avatar$3e$__["Avatar"].Root, {
        "data-slot": "avatar",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex size-8 shrink-0 overflow-hidden rounded-full", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/avatar.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = Avatar;
function AvatarImage({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$avatar$40$1$2e$1$2e$_5a9974e12961f75199f51bebee75bca6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$avatar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Avatar$3e$__["Avatar"].Image, {
        "data-slot": "avatar-image",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("aspect-square size-full", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/avatar.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
_c1 = AvatarImage;
function AvatarFallback({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$avatar$40$1$2e$1$2e$_5a9974e12961f75199f51bebee75bca6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$avatar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__Avatar$3e$__["Avatar"].Fallback, {
        "data-slot": "avatar-fallback",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-muted flex size-full items-center justify-center rounded-full", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/avatar.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_c2 = AvatarFallback;
;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "Avatar");
__turbopack_context__.k.register(_c1, "AvatarImage");
__turbopack_context__.k.register(_c2, "AvatarFallback");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(login)/data:c57081 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"007b06564f53b7ed9fd1e69546455501158a0ad304":"signOut"},"app/(login)/actions.ts",""] */ __turbopack_context__.s([
    "signOut",
    ()=>signOut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.59_react_4a6bd33c06d067053554ee20197f74c7/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var signOut = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("007b06564f53b7ed9fd1e69546455501158a0ad304", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "signOut"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcic7XHJcblxyXG5pbXBvcnQgeyB6IH0gZnJvbSAnem9kJztcclxuaW1wb3J0IHsgYW5kLCBlcSwgc3FsIH0gZnJvbSAnZHJpenpsZS1vcm0nO1xyXG5pbXBvcnQgeyBkYiB9IGZyb20gJ0AvbGliL2RiL2RyaXp6bGUnO1xyXG5pbXBvcnQge1xyXG4gIFVzZXIsXHJcbiAgdXNlcnMsXHJcbiAgdGVhbXMsXHJcbiAgdGVhbU1lbWJlcnMsXHJcbiAgYWN0aXZpdHlMb2dzLFxyXG4gIHR5cGUgTmV3VXNlcixcclxuICB0eXBlIE5ld1RlYW0sXHJcbiAgdHlwZSBOZXdUZWFtTWVtYmVyLFxyXG4gIHR5cGUgTmV3QWN0aXZpdHlMb2csXHJcbiAgQWN0aXZpdHlUeXBlLFxyXG4gIGludml0YXRpb25zXHJcbn0gZnJvbSAnQC9saWIvZGIvc2NoZW1hJztcclxuaW1wb3J0IHsgY29tcGFyZVBhc3N3b3JkcywgaGFzaFBhc3N3b3JkLCBzZXRTZXNzaW9uIH0gZnJvbSAnQC9saWIvYXV0aC9zZXNzaW9uJztcclxuaW1wb3J0IHsgcmVkaXJlY3QgfSBmcm9tICduZXh0L25hdmlnYXRpb24nO1xyXG5pbXBvcnQgeyBjb29raWVzIH0gZnJvbSAnbmV4dC9oZWFkZXJzJztcclxuaW1wb3J0IHsgY3JlYXRlQ2hlY2tvdXRTZXNzaW9uIH0gZnJvbSAnQC9saWIvcGF5bWVudHMvc3RyaXBlJztcclxuaW1wb3J0IHsgZ2V0VXNlciwgZ2V0VXNlcldpdGhUZWFtIH0gZnJvbSAnQC9saWIvZGIvcXVlcmllcyc7XHJcbmltcG9ydCB7XHJcbiAgdmFsaWRhdGVkQWN0aW9uLFxyXG4gIHZhbGlkYXRlZEFjdGlvbldpdGhVc2VyXHJcbn0gZnJvbSAnQC9saWIvYXV0aC9taWRkbGV3YXJlJztcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGxvZ0FjdGl2aXR5KFxyXG4gIHRlYW1JZDogbnVtYmVyIHwgbnVsbCB8IHVuZGVmaW5lZCxcclxuICB1c2VySWQ6IG51bWJlcixcclxuICB0eXBlOiBBY3Rpdml0eVR5cGUsXHJcbiAgaXBBZGRyZXNzPzogc3RyaW5nXHJcbikge1xyXG4gIGlmICh0ZWFtSWQgPT09IG51bGwgfHwgdGVhbUlkID09PSB1bmRlZmluZWQpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgY29uc3QgbmV3QWN0aXZpdHk6IE5ld0FjdGl2aXR5TG9nID0ge1xyXG4gICAgdGVhbUlkLFxyXG4gICAgdXNlcklkLFxyXG4gICAgYWN0aW9uOiB0eXBlLFxyXG4gICAgaXBBZGRyZXNzOiBpcEFkZHJlc3MgfHwgJydcclxuICB9O1xyXG4gIGF3YWl0IGRiLmluc2VydChhY3Rpdml0eUxvZ3MpLnZhbHVlcyhuZXdBY3Rpdml0eSk7XHJcbn1cclxuXHJcbmNvbnN0IHNpZ25JblNjaGVtYSA9IHoub2JqZWN0KHtcclxuICBlbWFpbDogei5zdHJpbmcoKS5lbWFpbCgpLm1pbigzKS5tYXgoMjU1KSxcclxuICBwYXNzd29yZDogei5zdHJpbmcoKS5taW4oOCkubWF4KDEwMClcclxufSk7XHJcblxyXG5leHBvcnQgY29uc3Qgc2lnbkluID0gdmFsaWRhdGVkQWN0aW9uKHNpZ25JblNjaGVtYSwgYXN5bmMgKGRhdGEsIGZvcm1EYXRhKSA9PiB7XHJcbiAgY29uc3QgeyBlbWFpbCwgcGFzc3dvcmQgfSA9IGRhdGE7XHJcblxyXG4gIGNvbnN0IHVzZXJXaXRoVGVhbSA9IGF3YWl0IGRiXHJcbiAgICAuc2VsZWN0KHtcclxuICAgICAgdXNlcjogdXNlcnMsXHJcbiAgICAgIHRlYW06IHRlYW1zXHJcbiAgICB9KVxyXG4gICAgLmZyb20odXNlcnMpXHJcbiAgICAubGVmdEpvaW4odGVhbU1lbWJlcnMsIGVxKHVzZXJzLmlkLCB0ZWFtTWVtYmVycy51c2VySWQpKVxyXG4gICAgLmxlZnRKb2luKHRlYW1zLCBlcSh0ZWFtTWVtYmVycy50ZWFtSWQsIHRlYW1zLmlkKSlcclxuICAgIC53aGVyZShlcSh1c2Vycy5lbWFpbCwgZW1haWwpKVxyXG4gICAgLmxpbWl0KDEpO1xyXG5cclxuICBpZiAodXNlcldpdGhUZWFtLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZXJyb3I6ICdJbnZhbGlkIGVtYWlsIG9yIHBhc3N3b3JkLiBQbGVhc2UgdHJ5IGFnYWluLicsXHJcbiAgICAgIGVtYWlsLFxyXG4gICAgICBwYXNzd29yZFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGNvbnN0IHsgdXNlcjogZm91bmRVc2VyLCB0ZWFtOiBmb3VuZFRlYW0gfSA9IHVzZXJXaXRoVGVhbVswXTtcclxuXHJcbiAgY29uc3QgaXNQYXNzd29yZFZhbGlkID0gYXdhaXQgY29tcGFyZVBhc3N3b3JkcyhcclxuICAgIHBhc3N3b3JkLFxyXG4gICAgZm91bmRVc2VyLnBhc3N3b3JkSGFzaFxyXG4gICk7XHJcblxyXG4gIGlmICghaXNQYXNzd29yZFZhbGlkKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBlcnJvcjogJ0ludmFsaWQgZW1haWwgb3IgcGFzc3dvcmQuIFBsZWFzZSB0cnkgYWdhaW4uJyxcclxuICAgICAgZW1haWwsXHJcbiAgICAgIHBhc3N3b3JkXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgYXdhaXQgUHJvbWlzZS5hbGwoW1xyXG4gICAgc2V0U2Vzc2lvbihmb3VuZFVzZXIpLFxyXG4gICAgbG9nQWN0aXZpdHkoZm91bmRUZWFtPy5pZCwgZm91bmRVc2VyLmlkLCBBY3Rpdml0eVR5cGUuU0lHTl9JTilcclxuICBdKTtcclxuXHJcbiAgY29uc3QgcmVkaXJlY3RUbyA9IGZvcm1EYXRhLmdldCgncmVkaXJlY3QnKSBhcyBzdHJpbmcgfCBudWxsO1xyXG4gIGlmIChyZWRpcmVjdFRvID09PSAnY2hlY2tvdXQnKSB7XHJcbiAgICBjb25zdCBwcmljZUlkID0gZm9ybURhdGEuZ2V0KCdwcmljZUlkJykgYXMgc3RyaW5nO1xyXG4gICAgcmV0dXJuIGNyZWF0ZUNoZWNrb3V0U2Vzc2lvbih7IHRlYW06IGZvdW5kVGVhbSwgcHJpY2VJZCB9KTtcclxuICB9XHJcblxyXG4gIHJlZGlyZWN0KCcvZGFzaGJvYXJkJyk7XHJcbn0pO1xyXG5cclxuY29uc3Qgc2lnblVwU2NoZW1hID0gei5vYmplY3Qoe1xyXG4gIGVtYWlsOiB6LnN0cmluZygpLmVtYWlsKCksXHJcbiAgcGFzc3dvcmQ6IHouc3RyaW5nKCkubWluKDgpLFxyXG4gIGludml0ZUlkOiB6LnN0cmluZygpLm9wdGlvbmFsKClcclxufSk7XHJcblxyXG5leHBvcnQgY29uc3Qgc2lnblVwID0gdmFsaWRhdGVkQWN0aW9uKHNpZ25VcFNjaGVtYSwgYXN5bmMgKGRhdGEsIGZvcm1EYXRhKSA9PiB7XHJcbiAgY29uc3QgeyBlbWFpbCwgcGFzc3dvcmQsIGludml0ZUlkIH0gPSBkYXRhO1xyXG5cclxuICBjb25zdCBleGlzdGluZ1VzZXIgPSBhd2FpdCBkYlxyXG4gICAgLnNlbGVjdCgpXHJcbiAgICAuZnJvbSh1c2VycylcclxuICAgIC53aGVyZShlcSh1c2Vycy5lbWFpbCwgZW1haWwpKVxyXG4gICAgLmxpbWl0KDEpO1xyXG5cclxuICBpZiAoZXhpc3RpbmdVc2VyLmxlbmd0aCA+IDApIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGVycm9yOiAnRmFpbGVkIHRvIGNyZWF0ZSB1c2VyLiBQbGVhc2UgdHJ5IGFnYWluLicsXHJcbiAgICAgIGVtYWlsLFxyXG4gICAgICBwYXNzd29yZFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGNvbnN0IHBhc3N3b3JkSGFzaCA9IGF3YWl0IGhhc2hQYXNzd29yZChwYXNzd29yZCk7XHJcblxyXG4gIGNvbnN0IG5ld1VzZXI6IE5ld1VzZXIgPSB7XHJcbiAgICBlbWFpbCxcclxuICAgIHBhc3N3b3JkSGFzaCxcclxuICAgIHJvbGU6ICdvd25lcicgLy8gRGVmYXVsdCByb2xlLCB3aWxsIGJlIG92ZXJyaWRkZW4gaWYgdGhlcmUncyBhbiBpbnZpdGF0aW9uXHJcbiAgfTtcclxuXHJcbiAgY29uc3QgW2NyZWF0ZWRVc2VyXSA9IGF3YWl0IGRiLmluc2VydCh1c2VycykudmFsdWVzKG5ld1VzZXIpLnJldHVybmluZygpO1xyXG5cclxuICBpZiAoIWNyZWF0ZWRVc2VyKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBlcnJvcjogJ0ZhaWxlZCB0byBjcmVhdGUgdXNlci4gUGxlYXNlIHRyeSBhZ2Fpbi4nLFxyXG4gICAgICBlbWFpbCxcclxuICAgICAgcGFzc3dvcmRcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBsZXQgdGVhbUlkOiBudW1iZXI7XHJcbiAgbGV0IHVzZXJSb2xlOiBzdHJpbmc7XHJcbiAgbGV0IGNyZWF0ZWRUZWFtOiB0eXBlb2YgdGVhbXMuJGluZmVyU2VsZWN0IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gIGlmIChpbnZpdGVJZCkge1xyXG4gICAgLy8gQ2hlY2sgaWYgdGhlcmUncyBhIHZhbGlkIGludml0YXRpb25cclxuICAgIGNvbnN0IFtpbnZpdGF0aW9uXSA9IGF3YWl0IGRiXHJcbiAgICAgIC5zZWxlY3QoKVxyXG4gICAgICAuZnJvbShpbnZpdGF0aW9ucylcclxuICAgICAgLndoZXJlKFxyXG4gICAgICAgIGFuZChcclxuICAgICAgICAgIGVxKGludml0YXRpb25zLmlkLCBwYXJzZUludChpbnZpdGVJZCkpLFxyXG4gICAgICAgICAgZXEoaW52aXRhdGlvbnMuZW1haWwsIGVtYWlsKSxcclxuICAgICAgICAgIGVxKGludml0YXRpb25zLnN0YXR1cywgJ3BlbmRpbmcnKVxyXG4gICAgICAgIClcclxuICAgICAgKVxyXG4gICAgICAubGltaXQoMSk7XHJcblxyXG4gICAgaWYgKGludml0YXRpb24pIHtcclxuICAgICAgdGVhbUlkID0gaW52aXRhdGlvbi50ZWFtSWQ7XHJcbiAgICAgIHVzZXJSb2xlID0gaW52aXRhdGlvbi5yb2xlO1xyXG5cclxuICAgICAgYXdhaXQgZGJcclxuICAgICAgICAudXBkYXRlKGludml0YXRpb25zKVxyXG4gICAgICAgIC5zZXQoeyBzdGF0dXM6ICdhY2NlcHRlZCcgfSlcclxuICAgICAgICAud2hlcmUoZXEoaW52aXRhdGlvbnMuaWQsIGludml0YXRpb24uaWQpKTtcclxuXHJcbiAgICAgIGF3YWl0IGxvZ0FjdGl2aXR5KHRlYW1JZCwgY3JlYXRlZFVzZXIuaWQsIEFjdGl2aXR5VHlwZS5BQ0NFUFRfSU5WSVRBVElPTik7XHJcblxyXG4gICAgICBbY3JlYXRlZFRlYW1dID0gYXdhaXQgZGJcclxuICAgICAgICAuc2VsZWN0KClcclxuICAgICAgICAuZnJvbSh0ZWFtcylcclxuICAgICAgICAud2hlcmUoZXEodGVhbXMuaWQsIHRlYW1JZCkpXHJcbiAgICAgICAgLmxpbWl0KDEpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHsgZXJyb3I6ICdJbnZhbGlkIG9yIGV4cGlyZWQgaW52aXRhdGlvbi4nLCBlbWFpbCwgcGFzc3dvcmQgfTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgLy8gQ3JlYXRlIGEgbmV3IHRlYW0gaWYgdGhlcmUncyBubyBpbnZpdGF0aW9uXHJcbiAgICBjb25zdCBuZXdUZWFtOiBOZXdUZWFtID0ge1xyXG4gICAgICBuYW1lOiBgJHtlbWFpbH0ncyBUZWFtYFxyXG4gICAgfTtcclxuXHJcbiAgICBbY3JlYXRlZFRlYW1dID0gYXdhaXQgZGIuaW5zZXJ0KHRlYW1zKS52YWx1ZXMobmV3VGVhbSkucmV0dXJuaW5nKCk7XHJcblxyXG4gICAgaWYgKCFjcmVhdGVkVGVhbSkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGVycm9yOiAnRmFpbGVkIHRvIGNyZWF0ZSB0ZWFtLiBQbGVhc2UgdHJ5IGFnYWluLicsXHJcbiAgICAgICAgZW1haWwsXHJcbiAgICAgICAgcGFzc3dvcmRcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICB0ZWFtSWQgPSBjcmVhdGVkVGVhbS5pZDtcclxuICAgIHVzZXJSb2xlID0gJ293bmVyJztcclxuXHJcbiAgICBhd2FpdCBsb2dBY3Rpdml0eSh0ZWFtSWQsIGNyZWF0ZWRVc2VyLmlkLCBBY3Rpdml0eVR5cGUuQ1JFQVRFX1RFQU0pO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgbmV3VGVhbU1lbWJlcjogTmV3VGVhbU1lbWJlciA9IHtcclxuICAgIHVzZXJJZDogY3JlYXRlZFVzZXIuaWQsXHJcbiAgICB0ZWFtSWQ6IHRlYW1JZCxcclxuICAgIHJvbGU6IHVzZXJSb2xlXHJcbiAgfTtcclxuXHJcbiAgYXdhaXQgUHJvbWlzZS5hbGwoW1xyXG4gICAgZGIuaW5zZXJ0KHRlYW1NZW1iZXJzKS52YWx1ZXMobmV3VGVhbU1lbWJlciksXHJcbiAgICBsb2dBY3Rpdml0eSh0ZWFtSWQsIGNyZWF0ZWRVc2VyLmlkLCBBY3Rpdml0eVR5cGUuU0lHTl9VUCksXHJcbiAgICBzZXRTZXNzaW9uKGNyZWF0ZWRVc2VyKVxyXG4gIF0pO1xyXG5cclxuICBjb25zdCByZWRpcmVjdFRvID0gZm9ybURhdGEuZ2V0KCdyZWRpcmVjdCcpIGFzIHN0cmluZyB8IG51bGw7XHJcbiAgaWYgKHJlZGlyZWN0VG8gPT09ICdjaGVja291dCcpIHtcclxuICAgIGNvbnN0IHByaWNlSWQgPSBmb3JtRGF0YS5nZXQoJ3ByaWNlSWQnKSBhcyBzdHJpbmc7XHJcbiAgICByZXR1cm4gY3JlYXRlQ2hlY2tvdXRTZXNzaW9uKHsgdGVhbTogY3JlYXRlZFRlYW0sIHByaWNlSWQgfSk7XHJcbiAgfVxyXG5cclxuICByZWRpcmVjdCgnL2Rhc2hib2FyZCcpO1xyXG59KTtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzaWduT3V0KCkge1xyXG4gIGNvbnN0IHVzZXIgPSAoYXdhaXQgZ2V0VXNlcigpKSBhcyBVc2VyO1xyXG4gIGNvbnN0IHVzZXJXaXRoVGVhbSA9IGF3YWl0IGdldFVzZXJXaXRoVGVhbSh1c2VyLmlkKTtcclxuICBhd2FpdCBsb2dBY3Rpdml0eSh1c2VyV2l0aFRlYW0/LnRlYW1JZCwgdXNlci5pZCwgQWN0aXZpdHlUeXBlLlNJR05fT1VUKTtcclxuICAoYXdhaXQgY29va2llcygpKS5kZWxldGUoJ3Nlc3Npb24nKTtcclxufVxyXG5cclxuY29uc3QgdXBkYXRlUGFzc3dvcmRTY2hlbWEgPSB6Lm9iamVjdCh7XHJcbiAgY3VycmVudFBhc3N3b3JkOiB6LnN0cmluZygpLm1pbig4KS5tYXgoMTAwKSxcclxuICBuZXdQYXNzd29yZDogei5zdHJpbmcoKS5taW4oOCkubWF4KDEwMCksXHJcbiAgY29uZmlybVBhc3N3b3JkOiB6LnN0cmluZygpLm1pbig4KS5tYXgoMTAwKVxyXG59KTtcclxuXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVQYXNzd29yZCA9IHZhbGlkYXRlZEFjdGlvbldpdGhVc2VyKFxyXG4gIHVwZGF0ZVBhc3N3b3JkU2NoZW1hLFxyXG4gIGFzeW5jIChkYXRhLCBfLCB1c2VyKSA9PiB7XHJcbiAgICBjb25zdCB7IGN1cnJlbnRQYXNzd29yZCwgbmV3UGFzc3dvcmQsIGNvbmZpcm1QYXNzd29yZCB9ID0gZGF0YTtcclxuXHJcbiAgICBjb25zdCBpc1Bhc3N3b3JkVmFsaWQgPSBhd2FpdCBjb21wYXJlUGFzc3dvcmRzKFxyXG4gICAgICBjdXJyZW50UGFzc3dvcmQsXHJcbiAgICAgIHVzZXIucGFzc3dvcmRIYXNoXHJcbiAgICApO1xyXG5cclxuICAgIGlmICghaXNQYXNzd29yZFZhbGlkKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgY3VycmVudFBhc3N3b3JkLFxyXG4gICAgICAgIG5ld1Bhc3N3b3JkLFxyXG4gICAgICAgIGNvbmZpcm1QYXNzd29yZCxcclxuICAgICAgICBlcnJvcjogJ0N1cnJlbnQgcGFzc3dvcmQgaXMgaW5jb3JyZWN0LidcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY3VycmVudFBhc3N3b3JkID09PSBuZXdQYXNzd29yZCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGN1cnJlbnRQYXNzd29yZCxcclxuICAgICAgICBuZXdQYXNzd29yZCxcclxuICAgICAgICBjb25maXJtUGFzc3dvcmQsXHJcbiAgICAgICAgZXJyb3I6ICdOZXcgcGFzc3dvcmQgbXVzdCBiZSBkaWZmZXJlbnQgZnJvbSB0aGUgY3VycmVudCBwYXNzd29yZC4nXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNvbmZpcm1QYXNzd29yZCAhPT0gbmV3UGFzc3dvcmQpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBjdXJyZW50UGFzc3dvcmQsXHJcbiAgICAgICAgbmV3UGFzc3dvcmQsXHJcbiAgICAgICAgY29uZmlybVBhc3N3b3JkLFxyXG4gICAgICAgIGVycm9yOiAnTmV3IHBhc3N3b3JkIGFuZCBjb25maXJtYXRpb24gcGFzc3dvcmQgZG8gbm90IG1hdGNoLidcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBuZXdQYXNzd29yZEhhc2ggPSBhd2FpdCBoYXNoUGFzc3dvcmQobmV3UGFzc3dvcmQpO1xyXG4gICAgY29uc3QgdXNlcldpdGhUZWFtID0gYXdhaXQgZ2V0VXNlcldpdGhUZWFtKHVzZXIuaWQpO1xyXG5cclxuICAgIGF3YWl0IFByb21pc2UuYWxsKFtcclxuICAgICAgZGJcclxuICAgICAgICAudXBkYXRlKHVzZXJzKVxyXG4gICAgICAgIC5zZXQoeyBwYXNzd29yZEhhc2g6IG5ld1Bhc3N3b3JkSGFzaCB9KVxyXG4gICAgICAgIC53aGVyZShlcSh1c2Vycy5pZCwgdXNlci5pZCkpLFxyXG4gICAgICBsb2dBY3Rpdml0eSh1c2VyV2l0aFRlYW0/LnRlYW1JZCwgdXNlci5pZCwgQWN0aXZpdHlUeXBlLlVQREFURV9QQVNTV09SRClcclxuICAgIF0pO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHN1Y2Nlc3M6ICdQYXNzd29yZCB1cGRhdGVkIHN1Y2Nlc3NmdWxseS4nXHJcbiAgICB9O1xyXG4gIH1cclxuKTtcclxuXHJcbmNvbnN0IGRlbGV0ZUFjY291bnRTY2hlbWEgPSB6Lm9iamVjdCh7XHJcbiAgcGFzc3dvcmQ6IHouc3RyaW5nKCkubWluKDgpLm1heCgxMDApXHJcbn0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGRlbGV0ZUFjY291bnQgPSB2YWxpZGF0ZWRBY3Rpb25XaXRoVXNlcihcclxuICBkZWxldGVBY2NvdW50U2NoZW1hLFxyXG4gIGFzeW5jIChkYXRhLCBfLCB1c2VyKSA9PiB7XHJcbiAgICBjb25zdCB7IHBhc3N3b3JkIH0gPSBkYXRhO1xyXG5cclxuICAgIGNvbnN0IGlzUGFzc3dvcmRWYWxpZCA9IGF3YWl0IGNvbXBhcmVQYXNzd29yZHMocGFzc3dvcmQsIHVzZXIucGFzc3dvcmRIYXNoKTtcclxuICAgIGlmICghaXNQYXNzd29yZFZhbGlkKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgcGFzc3dvcmQsXHJcbiAgICAgICAgZXJyb3I6ICdJbmNvcnJlY3QgcGFzc3dvcmQuIEFjY291bnQgZGVsZXRpb24gZmFpbGVkLidcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB1c2VyV2l0aFRlYW0gPSBhd2FpdCBnZXRVc2VyV2l0aFRlYW0odXNlci5pZCk7XHJcblxyXG4gICAgYXdhaXQgbG9nQWN0aXZpdHkoXHJcbiAgICAgIHVzZXJXaXRoVGVhbT8udGVhbUlkLFxyXG4gICAgICB1c2VyLmlkLFxyXG4gICAgICBBY3Rpdml0eVR5cGUuREVMRVRFX0FDQ09VTlRcclxuICAgICk7XHJcblxyXG4gICAgLy8gU29mdCBkZWxldGVcclxuICAgIGF3YWl0IGRiXHJcbiAgICAgIC51cGRhdGUodXNlcnMpXHJcbiAgICAgIC5zZXQoe1xyXG4gICAgICAgIGRlbGV0ZWRBdDogc3FsYENVUlJFTlRfVElNRVNUQU1QYCxcclxuICAgICAgICBlbWFpbDogc3FsYENPTkNBVChlbWFpbCwgJy0nLCBpZCwgJy1kZWxldGVkJylgIC8vIEVuc3VyZSBlbWFpbCB1bmlxdWVuZXNzXHJcbiAgICAgIH0pXHJcbiAgICAgIC53aGVyZShlcSh1c2Vycy5pZCwgdXNlci5pZCkpO1xyXG5cclxuICAgIGlmICh1c2VyV2l0aFRlYW0/LnRlYW1JZCkge1xyXG4gICAgICBhd2FpdCBkYlxyXG4gICAgICAgIC5kZWxldGUodGVhbU1lbWJlcnMpXHJcbiAgICAgICAgLndoZXJlKFxyXG4gICAgICAgICAgYW5kKFxyXG4gICAgICAgICAgICBlcSh0ZWFtTWVtYmVycy51c2VySWQsIHVzZXIuaWQpLFxyXG4gICAgICAgICAgICBlcSh0ZWFtTWVtYmVycy50ZWFtSWQsIHVzZXJXaXRoVGVhbS50ZWFtSWQpXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAoYXdhaXQgY29va2llcygpKS5kZWxldGUoJ3Nlc3Npb24nKTtcclxuICAgIHJlZGlyZWN0KCcvc2lnbi1pbicpO1xyXG4gIH1cclxuKTtcclxuXHJcbmNvbnN0IHVwZGF0ZUFjY291bnRTY2hlbWEgPSB6Lm9iamVjdCh7XHJcbiAgbmFtZTogei5zdHJpbmcoKS5taW4oMSwgJ05hbWUgaXMgcmVxdWlyZWQnKS5tYXgoMTAwKSxcclxuICBlbWFpbDogei5zdHJpbmcoKS5lbWFpbCgnSW52YWxpZCBlbWFpbCBhZGRyZXNzJylcclxufSk7XHJcblxyXG5leHBvcnQgY29uc3QgdXBkYXRlQWNjb3VudCA9IHZhbGlkYXRlZEFjdGlvbldpdGhVc2VyKFxyXG4gIHVwZGF0ZUFjY291bnRTY2hlbWEsXHJcbiAgYXN5bmMgKGRhdGEsIF8sIHVzZXIpID0+IHtcclxuICAgIGNvbnN0IHsgbmFtZSwgZW1haWwgfSA9IGRhdGE7XHJcbiAgICBjb25zdCB1c2VyV2l0aFRlYW0gPSBhd2FpdCBnZXRVc2VyV2l0aFRlYW0odXNlci5pZCk7XHJcblxyXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xyXG4gICAgICBkYi51cGRhdGUodXNlcnMpLnNldCh7IG5hbWUsIGVtYWlsIH0pLndoZXJlKGVxKHVzZXJzLmlkLCB1c2VyLmlkKSksXHJcbiAgICAgIGxvZ0FjdGl2aXR5KHVzZXJXaXRoVGVhbT8udGVhbUlkLCB1c2VyLmlkLCBBY3Rpdml0eVR5cGUuVVBEQVRFX0FDQ09VTlQpXHJcbiAgICBdKTtcclxuXHJcbiAgICByZXR1cm4geyBuYW1lLCBzdWNjZXNzOiAnQWNjb3VudCB1cGRhdGVkIHN1Y2Nlc3NmdWxseS4nIH07XHJcbiAgfVxyXG4pO1xyXG5cclxuY29uc3QgcmVtb3ZlVGVhbU1lbWJlclNjaGVtYSA9IHoub2JqZWN0KHtcclxuICBtZW1iZXJJZDogei5udW1iZXIoKVxyXG59KTtcclxuXHJcbmV4cG9ydCBjb25zdCByZW1vdmVUZWFtTWVtYmVyID0gdmFsaWRhdGVkQWN0aW9uV2l0aFVzZXIoXHJcbiAgcmVtb3ZlVGVhbU1lbWJlclNjaGVtYSxcclxuICBhc3luYyAoZGF0YSwgXywgdXNlcikgPT4ge1xyXG4gICAgY29uc3QgeyBtZW1iZXJJZCB9ID0gZGF0YTtcclxuICAgIGNvbnN0IHVzZXJXaXRoVGVhbSA9IGF3YWl0IGdldFVzZXJXaXRoVGVhbSh1c2VyLmlkKTtcclxuXHJcbiAgICBpZiAoIXVzZXJXaXRoVGVhbT8udGVhbUlkKSB7XHJcbiAgICAgIHJldHVybiB7IGVycm9yOiAnVXNlciBpcyBub3QgcGFydCBvZiBhIHRlYW0nIH07XHJcbiAgICB9XHJcblxyXG4gICAgYXdhaXQgZGJcclxuICAgICAgLmRlbGV0ZSh0ZWFtTWVtYmVycylcclxuICAgICAgLndoZXJlKFxyXG4gICAgICAgIGFuZChcclxuICAgICAgICAgIGVxKHRlYW1NZW1iZXJzLmlkLCBtZW1iZXJJZCksXHJcbiAgICAgICAgICBlcSh0ZWFtTWVtYmVycy50ZWFtSWQsIHVzZXJXaXRoVGVhbS50ZWFtSWQpXHJcbiAgICAgICAgKVxyXG4gICAgICApO1xyXG5cclxuICAgIGF3YWl0IGxvZ0FjdGl2aXR5KFxyXG4gICAgICB1c2VyV2l0aFRlYW0udGVhbUlkLFxyXG4gICAgICB1c2VyLmlkLFxyXG4gICAgICBBY3Rpdml0eVR5cGUuUkVNT1ZFX1RFQU1fTUVNQkVSXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiB7IHN1Y2Nlc3M6ICdUZWFtIG1lbWJlciByZW1vdmVkIHN1Y2Nlc3NmdWxseScgfTtcclxuICB9XHJcbik7XHJcblxyXG5jb25zdCBpbnZpdGVUZWFtTWVtYmVyU2NoZW1hID0gei5vYmplY3Qoe1xyXG4gIGVtYWlsOiB6LnN0cmluZygpLmVtYWlsKCdJbnZhbGlkIGVtYWlsIGFkZHJlc3MnKSxcclxuICByb2xlOiB6LmVudW0oWydtZW1iZXInLCAnb3duZXInXSlcclxufSk7XHJcblxyXG5leHBvcnQgY29uc3QgaW52aXRlVGVhbU1lbWJlciA9IHZhbGlkYXRlZEFjdGlvbldpdGhVc2VyKFxyXG4gIGludml0ZVRlYW1NZW1iZXJTY2hlbWEsXHJcbiAgYXN5bmMgKGRhdGEsIF8sIHVzZXIpID0+IHtcclxuICAgIGNvbnN0IHsgZW1haWwsIHJvbGUgfSA9IGRhdGE7XHJcbiAgICBjb25zdCB1c2VyV2l0aFRlYW0gPSBhd2FpdCBnZXRVc2VyV2l0aFRlYW0odXNlci5pZCk7XHJcblxyXG4gICAgaWYgKCF1c2VyV2l0aFRlYW0/LnRlYW1JZCkge1xyXG4gICAgICByZXR1cm4geyBlcnJvcjogJ1VzZXIgaXMgbm90IHBhcnQgb2YgYSB0ZWFtJyB9O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGV4aXN0aW5nTWVtYmVyID0gYXdhaXQgZGJcclxuICAgICAgLnNlbGVjdCgpXHJcbiAgICAgIC5mcm9tKHVzZXJzKVxyXG4gICAgICAubGVmdEpvaW4odGVhbU1lbWJlcnMsIGVxKHVzZXJzLmlkLCB0ZWFtTWVtYmVycy51c2VySWQpKVxyXG4gICAgICAud2hlcmUoXHJcbiAgICAgICAgYW5kKGVxKHVzZXJzLmVtYWlsLCBlbWFpbCksIGVxKHRlYW1NZW1iZXJzLnRlYW1JZCwgdXNlcldpdGhUZWFtLnRlYW1JZCkpXHJcbiAgICAgIClcclxuICAgICAgLmxpbWl0KDEpO1xyXG5cclxuICAgIGlmIChleGlzdGluZ01lbWJlci5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHJldHVybiB7IGVycm9yOiAnVXNlciBpcyBhbHJlYWR5IGEgbWVtYmVyIG9mIHRoaXMgdGVhbScgfTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBpZiB0aGVyZSdzIGFuIGV4aXN0aW5nIGludml0YXRpb25cclxuICAgIGNvbnN0IGV4aXN0aW5nSW52aXRhdGlvbiA9IGF3YWl0IGRiXHJcbiAgICAgIC5zZWxlY3QoKVxyXG4gICAgICAuZnJvbShpbnZpdGF0aW9ucylcclxuICAgICAgLndoZXJlKFxyXG4gICAgICAgIGFuZChcclxuICAgICAgICAgIGVxKGludml0YXRpb25zLmVtYWlsLCBlbWFpbCksXHJcbiAgICAgICAgICBlcShpbnZpdGF0aW9ucy50ZWFtSWQsIHVzZXJXaXRoVGVhbS50ZWFtSWQpLFxyXG4gICAgICAgICAgZXEoaW52aXRhdGlvbnMuc3RhdHVzLCAncGVuZGluZycpXHJcbiAgICAgICAgKVxyXG4gICAgICApXHJcbiAgICAgIC5saW1pdCgxKTtcclxuXHJcbiAgICBpZiAoZXhpc3RpbmdJbnZpdGF0aW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgcmV0dXJuIHsgZXJyb3I6ICdBbiBpbnZpdGF0aW9uIGhhcyBhbHJlYWR5IGJlZW4gc2VudCB0byB0aGlzIGVtYWlsJyB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENyZWF0ZSBhIG5ldyBpbnZpdGF0aW9uXHJcbiAgICBhd2FpdCBkYi5pbnNlcnQoaW52aXRhdGlvbnMpLnZhbHVlcyh7XHJcbiAgICAgIHRlYW1JZDogdXNlcldpdGhUZWFtLnRlYW1JZCxcclxuICAgICAgZW1haWwsXHJcbiAgICAgIHJvbGUsXHJcbiAgICAgIGludml0ZWRCeTogdXNlci5pZCxcclxuICAgICAgc3RhdHVzOiAncGVuZGluZydcclxuICAgIH0pO1xyXG5cclxuICAgIGF3YWl0IGxvZ0FjdGl2aXR5KFxyXG4gICAgICB1c2VyV2l0aFRlYW0udGVhbUlkLFxyXG4gICAgICB1c2VyLmlkLFxyXG4gICAgICBBY3Rpdml0eVR5cGUuSU5WSVRFX1RFQU1fTUVNQkVSXHJcbiAgICApO1xyXG5cclxuICAgIC8vIFRPRE86IFNlbmQgaW52aXRhdGlvbiBlbWFpbCBhbmQgaW5jbHVkZSA/aW52aXRlSWQ9e2lkfSB0byBzaWduLXVwIFVSTFxyXG4gICAgLy8gYXdhaXQgc2VuZEludml0YXRpb25FbWFpbChlbWFpbCwgdXNlcldpdGhUZWFtLnRlYW0ubmFtZSwgcm9sZSlcclxuXHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiAnSW52aXRhdGlvbiBzZW50IHN1Y2Nlc3NmdWxseScgfTtcclxuICB9XHJcbik7XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoidVJBK05zQiJ9
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(dashboard)/layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Layout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.59_react_4a6bd33c06d067053554ee20197f74c7/node_modules/next/dist/compiled/react-experimental/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.59_react_4a6bd33c06d067053554ee20197f74c7/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.59_react_4a6bd33c06d067053554ee20197f74c7/node_modules/next/dist/compiled/react-experimental/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$511$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.511.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/circle.js [app-client] (ecmascript) <export default as CircleIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$511$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.511.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$511$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.511.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$login$292f$data$3a$c57081__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/app/(login)/data:c57081 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.6.0-canary.59_react_4a6bd33c06d067053554ee20197f74c7/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$swr$40$2$2e$3$2e$3_react$40$19$2e$1$2e$0$2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/swr@2.3.3_react@19.1.0/node_modules/swr/dist/index/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$swr$40$2$2e$3$2e$3_react$40$19$2e$1$2e$0$2f$node_modules$2f$swr$2f$dist$2f$_internal$2f$config$2d$context$2d$client$2d$v7VOFo66$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__j__as__mutate$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/swr@2.3.3_react@19.1.0/node_modules/swr/dist/_internal/config-context-client-v7VOFo66.mjs [app-client] (ecmascript) <export j as mutate>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
const fetcher = (url)=>fetch(url).then((res)=>res.json());
function UserMenu() {
    _s();
    const [isMenuOpen, setIsMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { data: user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$swr$40$2$2e$3$2e$3_react$40$19$2e$1$2e$0$2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])('/api/user', fetcher);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    async function handleSignOut() {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$login$292f$data$3a$c57081__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["signOut"])();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$swr$40$2$2e$3$2e$3_react$40$19$2e$1$2e$0$2f$node_modules$2f$swr$2f$dist$2f$_internal$2f$config$2d$context$2d$client$2d$v7VOFo66$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__j__as__mutate$3e$__["mutate"])('/api/user');
        router.push('/');
    }
    if (!user) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/pricing",
                    className: "text-sm font-medium text-gray-700 hover:text-gray-900",
                    children: "Pricing"
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/layout.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    asChild: true,
                    className: "rounded-full",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/sign-up",
                        children: "Sign Up"
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/layout.tsx",
                        lineNumber: 42,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/layout.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
        open: isMenuOpen,
        onOpenChange: setIsMenuOpen,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                    className: "cursor-pointer size-9",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarImage"], {
                            alt: user.name || ''
                        }, void 0, false, {
                            fileName: "[project]/app/(dashboard)/layout.tsx",
                            lineNumber: 52,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                            children: user.email.split(' ').map((n)=>n[0]).join('')
                        }, void 0, false, {
                            fileName: "[project]/app/(dashboard)/layout.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(dashboard)/layout.tsx",
                    lineNumber: 51,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/layout.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                align: "end",
                className: "flex flex-col gap-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                        className: "cursor-pointer",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/dashboard",
                            className: "flex w-full items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$511$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                    className: "mr-2 h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/layout.tsx",
                                    lineNumber: 64,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Dashboard"
                                }, void 0, false, {
                                    fileName: "[project]/app/(dashboard)/layout.tsx",
                                    lineNumber: 65,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(dashboard)/layout.tsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/layout.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        action: handleSignOut,
                        className: "w-full",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "submit",
                            className: "flex w-full",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                className: "w-full flex-1 cursor-pointer",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$511$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                        className: "mr-2 h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/layout.tsx",
                                        lineNumber: 71,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Sign out"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/layout.tsx",
                                        lineNumber: 72,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(dashboard)/layout.tsx",
                                lineNumber: 70,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(dashboard)/layout.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/layout.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(dashboard)/layout.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(dashboard)/layout.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_s(UserMenu, "OShuk6PKNdvgBYo6hHCxXyc8R0s=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$swr$40$2$2e$3$2e$3_react$40$19$2e$1$2e$0$2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = UserMenu;
function Header() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "border-b border-gray-200",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/",
                    className: "flex items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$511$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleIcon$3e$__["CircleIcon"], {
                            className: "h-6 w-6 text-orange-500"
                        }, void 0, false, {
                            fileName: "[project]/app/(dashboard)/layout.tsx",
                            lineNumber: 86,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "ml-2 text-xl font-semibold text-gray-900",
                            children: "ACME"
                        }, void 0, false, {
                            fileName: "[project]/app/(dashboard)/layout.tsx",
                            lineNumber: 87,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(dashboard)/layout.tsx",
                    lineNumber: 85,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center space-x-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
                        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-9"
                        }, void 0, false, {
                            fileName: "[project]/app/(dashboard)/layout.tsx",
                            lineNumber: 90,
                            columnNumber: 31
                        }, void 0),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UserMenu, {}, void 0, false, {
                            fileName: "[project]/app/(dashboard)/layout.tsx",
                            lineNumber: 91,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(dashboard)/layout.tsx",
                        lineNumber: 90,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/layout.tsx",
                    lineNumber: 89,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(dashboard)/layout.tsx",
            lineNumber: 84,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(dashboard)/layout.tsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
}
_c1 = Header;
function Layout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "flex flex-col min-h-screen",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$6$2e$0$2d$canary$2e$59_react_4a6bd33c06d067053554ee20197f74c7$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Header, {}, void 0, false, {
                fileName: "[project]/app/(dashboard)/layout.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/app/(dashboard)/layout.tsx",
        lineNumber: 101,
        columnNumber: 5
    }, this);
}
_c2 = Layout;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "UserMenu");
__turbopack_context__.k.register(_c1, "Header");
__turbopack_context__.k.register(_c2, "Layout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_a312262c._.js.map