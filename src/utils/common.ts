export function isEmpty(value: string): boolean {
    return value === undefined || value === null || value === '' || value === 'undefined' || value === 'empty'
}

export function formatURL({ baseURL, url }: { baseURL: string; url: string }) {
    if (url.substring(0, 4).toLowerCase() === 'http') return url
    const root = baseURL.replace(/\/$/, '')
    url = url.replace(/^\//, '')
    return `${root}/${url}`
}

export const generateGUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(new RegExp('[xy]', 'g'), function (c) {
        const r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

export const getCookie = (key: string): string => {
    const name = key + '='
    const decodedCookie = decodeURIComponent(document.cookie)
    const ca = decodedCookie.split(';')
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ''
}

export const setCookie = (key: string, value: string, hours = 0): void => {
    let expires = ''
    if (hours >= 0) {
        const d = new Date()
        d.setTime(d.getTime() + hours * 60 * 60 * 1000)
        expires = `expires=${d.toUTCString()};path=/;`
    }
    const cookie = `${key}=${value};${expires}`

    document.cookie = cookie
}

export function flattenNestedData<T, K extends keyof T>(arr: Array<T>, childName: K): Array<T> {
    let res = [] as Array<T>
    arr.forEach((item) => {
        res.push(item)
        const children = item?.[childName] as Array<T>
        if (children && Array.isArray(children)) {
            res = res.concat(flattenNestedData(children, childName))
        }
    })
    return res
}

export function toPascalCase(input: string): string {
    let result = input.replace(/document|lineItems\[\]/g, '')

    result = result.replace(/[^a-zA-Z0-9]/g, ' ')

    result = result.replace(/\b[a-z]/g, function (match) {
        return match.toUpperCase()
    })

    result = result.replace(/ /g, '')

    return result
}
