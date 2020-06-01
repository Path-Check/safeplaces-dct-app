// The MIT License (MIT)
//
// Copyright (c) 2019 Naoki Hiroshima
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// Influenced by https://github.com/nh7a/Geohash/blob/master/Sources/Geohash/Geohash.swift
// GeoHash information https://www.movable-type.co.uk/scripts/geohash.html
import Foundation

public struct Geohash {
  public static func decode(hash: String) -> (latitude: (min: Double, max: Double), longitude: (min: Double, max: Double))? {
    // For example: hash = u4pruydqqvj
    let bits = hash.map { bitmap[$0] ?? "?" }.joined(separator: "")
    guard bits.count % 5 == 0 else { return nil }
    // bits = 1101000100101011011111010111100110010110101101101110001
    
    let (lat, lon) = bits.enumerated().reduce(into: ([Character](), [Character]())) {
      if $1.0 % 2 == 0 {
        $0.1.append($1.1)
      } else {
        $0.0.append($1.1)
      }
    }
    // lat = [1,1,0,1,0,0,0,1,1,1,1,1,1,1,0,1,0,1,1,0,0,1,1,0,1,0,0]
    // lon = [1,0,0,0,0,1,1,1,0,1,1,0,0,1,1,0,1,0,0,1,1,1,0,1,1,1,0,1]
    
    func combiner(array a: (min: Double, max: Double), value: Character) -> (Double, Double) {
      let mean = (a.min + a.max) / 2
      return value == "1" ? (mean, a.max) : (a.min, mean)
    }

    let latRange = lat.reduce((-90.0, 90.0), combiner)
    // latRange = (57.649109959602356, 57.649111300706863)
    
    let lonRange = lon.reduce((-180.0, 180.0), combiner)
    // lonRange = (10.407439023256302, 10.407440364360809)
    
    return (latRange, lonRange)
  }

  public static func encode(latitude: Double, longitude: Double, length: Int) -> String {
    // For example: (latitude, longitude) = (57.6491106301546, 10.4074396938086)
    func combiner(array a: (min: Double, max: Double, array: [String]), value: Double) -> (Double, Double, [String]) {
      let mean = (a.min + a.max) / 2
      if value < mean {
        return (a.min, mean, a.array + "0")
      } else {
        return (mean, a.max, a.array + "1")
      }
    }

    let lat = Array(repeating: latitude, count: length*5).reduce((-90.0, 90.0, [String]()), combiner)
    // lat = (57.64911063015461, 57.649110630154766, [1,1,0,1,0,0,0,1,1,1,1,1,1,1,0,1,0,1,1,0,0,1,1,0,1,0,0,1,0,0,...])
    
    let lon = Array(repeating: longitude, count: length*5).reduce((-180.0, 180.0, [String]()), combiner)
    // lon = (10.407439693808236, 10.407439693808556, [1,0,0,0,0,1,1,1,0,1,1,0,0,1,1,0,1,0,0,1,1,1,0,1,1,1,0,1,0,1,..])
    
    let latlon = lon.2.enumerated().flatMap { [$1, lat.2[$0]] }
    // latlon - [1,1,0,1,0,0,0,1,0,0,1,0,1,0,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,...]
    
    let bits = latlon.enumerated().reduce([String]()) { $1.0 % 5 > 0 ? $0 << $1.1 : $0 + $1.1 }
    //  bits: [11010,00100,10101,10111,11010,11110,01100,10110,10110,11011,10001,10010,10101,...]
    
    let arr = bits.compactMap { charmap[$0] }
    // arr: [u,4,p,r,u,y,d,q,q,v,j,k,p,b,...]
    
    return String(arr.prefix(length))
  }

  /// Radius around center point of a given location
  public static let GEO_CIRCLE_RADII: [(latitude: Double, longitude: Double)] = [
    (0, 0), // center
    (0.0001, 0), // N
    (0.00007, 0.00007), // NE
    (0, 0.0001), // E
    (-0.00007, 0.00007), // SE
    (-0.0001, 0), // S
    (-0.00007, -0.00007), // SW
    (0, -0.0001), // W
    (0.00007, -0.00007) //NW
  ]

  // MARK: Private
  private static let bitmap = "0123456789bcdefghjkmnpqrstuvwxyz".enumerated()
    .map {($1, String(integer: $0, radix: 2, padding: 5))}
    .reduce(into: [Character: String]()) { $0[$1.0] = $1.1 }

  private static let charmap = bitmap
    .reduce(into: [String: Character]()) { $0[$1.1] = $1.0 }
}

private func + (left: [String], right: String) -> [String] {
  var arr = left
  arr.append(right)
  return arr
}

private func << (left: [String], right: String) -> [String] {
  var arr = left
  var s = arr.popLast()!
  s += right
  arr.append(s)
  return arr
}
