declare module 'virtual:i18next-loader' {
    type Resource = import('i18next').Resource
    const resources: Resource
    export default resources
}
