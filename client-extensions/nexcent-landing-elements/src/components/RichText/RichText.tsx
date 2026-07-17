import {useMemo} from 'react';

const BLOCKED_ELEMENTS = 'script, style, iframe, object, embed, form';
const URL_ATTRIBUTES = new Set(['href', 'src', 'xlink:href']);

function sanitizeHtml(value: string): string {
    const template = document.createElement('template');

    template.innerHTML = value;

    template.content.querySelectorAll(BLOCKED_ELEMENTS).forEach((element) => {
        element.remove();
    });

    template.content.querySelectorAll<HTMLElement>('*').forEach((element) => {
        for (const attribute of Array.from(element.attributes)) {
            const name = attribute.name.toLowerCase();
            const attributeValue = attribute.value.trim().toLowerCase();

            if (name.startsWith('on') || name === 'style') {
                element.removeAttribute(attribute.name);
                continue;
            }

            if (
                URL_ATTRIBUTES.has(name) &&
                (attributeValue.startsWith('javascript:') ||
                    attributeValue.startsWith('data:text/html'))
            ) {
                element.removeAttribute(attribute.name);
            }
        }

        if (element.tagName === 'A' && element.getAttribute('target') === '_blank') {
            element.setAttribute('rel', 'noopener noreferrer');
        }
    });

    return template.innerHTML;
}

type RichTextProps = {
    className?: string;
    html: string;
};

export function RichText({className, html}: RichTextProps) {
    const safeHtml = useMemo(() => sanitizeHtml(html), [html]);

    if (!safeHtml) {
        return null;
    }

    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{__html: safeHtml}}
        />
    );
}
