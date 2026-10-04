import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Scrolls to the top on page change, or to the #section in the URL (e.g. /#contact).
// Depends on `key` too, so clicking the same link again still scrolls.
export default function ScrollToTop() {
    const { pathname, hash, key } = useLocation();
    const prevPathname = useRef(pathname);

    useEffect(() => {
        const samePage = prevPathname.current === pathname;
        prevPathname.current = pathname;

        if (hash) {
            const id = decodeURIComponent(hash.slice(1));
            // Wait a tick so a newly rendered page has its sections in the DOM
            const timer = setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, samePage ? 0 : 100);
            return () => clearTimeout(timer);
        }

        window.scrollTo({ top: 0, behavior: samePage ? "smooth" : "auto" });
    }, [pathname, hash, key]);

    return null;
}
