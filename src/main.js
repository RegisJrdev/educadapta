if (location.pathname === '/') {
    import('./main-vue.js');
} else {
    import('../react-app/src/main.tsx');
}
