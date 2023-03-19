export interface ICelestialBody {
    name: string, 
    gravity: number,
    imageUrl?: string,
    image?: HTMLImageElement
}

export const CELESTIAL_BODIES = [
    {
        name: "Earth",
        gravity: 9.8
    },
    {
        name: "Moon",
        gravity: 1.6
    },
    {
        name: "Mars",
        gravity: 3.7
    },
    {
        name: "Venus",
        gravity: 8.87
    },
    {
        name: "Jupiter",
        gravity: 24.5
    }    
]