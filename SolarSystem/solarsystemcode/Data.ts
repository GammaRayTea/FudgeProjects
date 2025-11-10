
namespace Data {
    export enum BODY { SUN, EARTH, MARS, MOON }
    export interface BodyData {
        id: BODY,
        name: string,
        orbitalRadius: number,
        rotationalSpeed: number,
        orbitSpeed: number,
        size: number
    }



    const bodies: BodyData[] = [
        { id: BODY.SUN, name: "sun", orbitalRadius: 0, rotationalSpeed: 0, orbitSpeed: 0, size: 10 },
        { id: BODY.EARTH, name: "earth", orbitalRadius: 150, rotationalSpeed: 1, orbitSpeed: 365, size: 4 },
        { id: BODY.MARS, name: "mars", orbitalRadius: 230, rotationalSpeed: 24.5, orbitSpeed: 688.2, size: 3 },
        { id: BODY.MOON, name: "moon", orbitalRadius: 30, rotationalSpeed: 1, orbitSpeed: 27, size: 1 }
    ]





    export function getData(_id: BODY): BodyData | null {
        for (const body of bodies) {
            if (body.id == _id) {
                return body;
            }
        }
        return null
    }
}