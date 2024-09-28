export type VersionType = {
    BuildDate: Date
    ClientId: string
    Deployment: string
    Description: string
    FileVersion: string
    Name: string
    PortalId: string
    Reference: string
    Services: Version[]
    Url: string
    Version: string
}

export type Service = {
    data?: Version
    getVersionUrl: string
    name: string
    showProtectedInformation: boolean
    url: string
    versionUrl: string
}

export type VersionState = {
    data: Service[]
}
