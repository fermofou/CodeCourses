declare module 'lucide-react' {
    import * as React from 'react';

    interface IconProps extends React.SVGAttributes<SVGElement> {
        size?: string | number;
        color?: string;
        stroke?: string | number;
    }

    type Icon = React.FC<IconProps>;

    export const Trophy: Icon;
    export const Brain: Icon;
    export const PlayCircle: Icon;
    export const CheckCircle2: Icon;
    export const Coins: Icon;
    export const Code: Icon;
    export const Terminal: Icon;
    export const ArrowRight: Icon;
    export const Gift: Icon;
    export const User: Icon;
    export const Target: Icon;
    export const Sparkles: Icon;
    export const Crown: Icon;
    export const Menu: Icon;
    export const Search: Icon;
    export const ShoppingCart: Icon;

    // Add any other icons you're using
} 