// export interface Context {}

export interface Media {
  id: string
  url: string
}

export interface Dimensions {
  width: number
  height: number
}

export interface Image extends Media {
  dimensions: Dimensions
}

export interface Video extends Media {
  dimensions: number
}
