 
function sinD(ang) {
    return Math.sin(ang*Math.PI/180)
}
function cosD(ang) {
    return Math.cos(ang*Math.PI/180)
}
function tanD(ang) {
    return Math.tan(ang*Math.PI/180)
}
class astro {
    static dot(a=[1,3,4],b=[3,4,5]) {
        return a.map((el,ii) => el * b[ii]).reduce((a,b) => a + b, 0)
    }
    static cross(a=[1,3,4],b=[3,4,5]) {
        // tbd
    }
    static rot (angle = 45, axis = 1, useDegree = true) {
        angle = useDegree ? angle*0.017453292519943295 : angle
        let rotMat;
        let sAng = Math.sin(angle), cAng = Math.cos(angle)
        if (axis === 1) {
            rotMat = [
                [1, 0, 0],
                [0, cAng, sAng],
                [0, -sAng, cAng]
            ];
        } else if (axis === 2) {
            rotMat = [
                [cAng, 0, -sAng],
                [0, 1, 0],
                [sAng, 0, cAng]
            ];
        } else {
            rotMat = [
                [cAng, sAng, 0],
                [-sAng, cAng, 0],
                [0, 0, 1]
            ]
        }
        return rotMat;
    }
    static siderealTime(jdUti=2448855.009722) {
        let tUti = (jdUti - 2451545.0) / 36525
        return ((67310.54841 + (876600*3600 + 8640184.812866)*tUti + 0.093104*tUti*tUti - 6.2e-6*tUti*tUti*tUti) % 86400)/240
    }
    static julianDate(yr=1996, mo=10, d=26, h=14, min=20, s=0) {
        return 367 * yr - Math.floor(7*(yr+Math.floor((mo+9)/12)) / 4) + Math.floor(275*mo/9) + d + 1721013.5 + ((s/60+min)/60+h)/24
    }
    static moonEciFromTime(startDate = new Date()) {
        let sind = ang => Math.sin(ang*Math.PI / 180)
        let cosd = ang => Math.cos(ang*Math.PI / 180)
        let jd = astro.julianDate(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate(), startDate.getHours(), startDate.getMinutes(), startDate.getSeconds()+startDate.getMilliseconds())
        let tdb = (jd - 2451545) / 36525
        // console.log(tdb);
        let lambda_ell = 218.32 + 481267.8813 * tdb + 6.29 * sind(134.9 + 477198.85 * tdb)-
            1.27*sind(259.2-413335.38*tdb) +
            0.66*sind(235.7+890534.23*tdb) +
            0.21*sind(269.9+954397.7*tdb) -
            0.19*sind(357.5+35999.05*tdb) -
            0.11*sind(186.6+966404.05*tdb)
        lambda_ell = lambda_ell % 360
        lambda_ell = lambda_ell < 0 ? lambda_ell + 360 : lambda_ell
        
        let phi_ell = 5.13*sind(93.3+483202.03*tdb) + 
            0.28*sind(228.2+960400.87*tdb) - 
            0.28*sind(318.3+6003.18*tdb) - 
            0.17*sind(217.6-407332.2*tdb)
        phi_ell = phi_ell % 360
        phi_ell = phi_ell < 0 ? phi_ell + 360 : phi_ell
       
        let para = 0.9508 + 
            0.0518*cosd(134.9+477_198.85*tdb) + 
            0.0095*cosd(259.2-413_335.38*tdb) +  
            0.0078*cosd(235.7+890_534.23*tdb) +  
            0.0028*cosd(269.9+954_397.7*tdb)
        para = para % 360
        para = para < 0 ? para + 360 : para
    
        let epsilon = 23.439291 - 0.0130042 * tdb-(1.64e-7)*tdb*tdb+(5.04e-7)*tdb*tdb*tdb
    
        let rC = 1 / sind(para) * 6378.1363
        
        return math.dotMultiply(rC, [cosd(phi_ell) * cosd(lambda_ell), 
                cosd(epsilon) * cosd(phi_ell) * sind(lambda_ell) - sind(epsilon) * sind(phi_ell), 
                sind(epsilon) * cosd(phi_ell) * sind(lambda_ell) + cosd(epsilon) * sind(phi_ell)])
    }
    static moonEciFromTimeNew(startDate = new Date(1992,3,12)) {
        let jd = astro.julianDate(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate(), startDate.getHours(), startDate.getMinutes(), startDate.getSeconds()+startDate.getMilliseconds())
        
        let T = (jd - 2451545) / 36525
        let L_ap = 218.3164591+481267.88134236*T-0.0013268*T*T+T*T*T/538841-T*T*T*T/65194000
        L_ap %= 360
        L_ap = L_ap < 0 ? 360+L_ap :L_ap
        let D = 297.8502042+445267.1115168*T-0.00163*T*T+T*T*T/545868-T*T*T*T/113065000
        D %= 360
        D = D < 0 ? 360+D :D
        let M = 357.5291092+35999.0502909*T-0.0001536*T*T+T*T*T/24490000
        M %= 360
        M = M < 0 ? 360+M : M
        let M_ap = 134.9634114+477198.8676313*T+0.008997*T*T+T*T*T/69699-T*T*T*T/14712000
        M_ap %= 360
        M_ap = M_ap < 0 ? 360+M_ap :M_ap
        let F = 93.2720993+483202.0175273*T-0.0034029*T*T-T*T*T/3526000+T*T*T*T/863310000
        F %= 360
        F = F < 0 ? 360+F :F
        let E = 1-0.002516*T-0.0000074*T*T
        let a1 = 119.75+131.849*T
        let a2 = 53.09+479264.29*T
        let a3 = 313.45+481266.484*T
        let multiples = [D, M, M_ap, F]
        let sigmaI = tables.sigmaI.reduce((a,b) => {
            let eMultiplier = math.abs(b[1]) > 1 ? E*E : math.abs(b[1]) > 0 ? E : 1
            return a + b[4]*eMultiplier*sinD(b.slice(0,4).map((c,ii) => c*multiples[ii]).reduce((a,b) => a+b,0))
        }, 0)
        sigmaI += 3958*sinD(a1)+1962*sinD(L_ap-F)+318*sinD(a2)
        
        let sigmaB = tables.sigmaB.reduce((a,b) => {
            let eMultiplier = math.abs(b[1]) > 1 ? E*E : math.abs(b[1]) > 0 ? E : 1
            return a + eMultiplier*b[4]*sinD(b.slice(0,4).map((c,ii) => c*multiples[ii]).reduce((a,b) => a+b,0))
        }, 0)
        sigmaB += -2235*sinD(L_ap)+382*sinD(a3)+175*sinD(a1-F)+175*sinD(L_ap+F)+127*sinD(L_ap-M_ap)-115*sinD(L_ap+M_ap)
        let sigmaR = tables.sigmaR.reduce((a,b) => {
            let eMultiplier = math.abs(b[1]) > 1 ? E*E : math.abs(b[1]) > 0 ? E : 1
            return a + eMultiplier*b[4]*cosD(b.slice(0,4).map((c,ii) => c*multiples[ii]).reduce((a,b) => a+b,0))
        }, 0)
        let coordinates = {
            long: L_ap+sigmaI/1000000,
            lat: sigmaB/1000000,
            r: 385000.56+sigmaR/1000
        }
        console.log(coordinates);
        let epsilon = (23*3600+26*60+21.448-46.8150*T-0.00059*T*T+0.001813*T*T*T)/3600
        
        let long = math.atan2((sinD(coordinates.long)*cosD(epsilon)-tanD(coordinates.lat)*sinD(epsilon)),cosD(coordinates.long))*180/Math.PI
        
        let lat = math.asin(sinD(coordinates.lat)*cosD(epsilon)+cosD(coordinates.lat)*sinD(epsilon)*sinD(coordinates.long))*180/Math.PI
        return [cosD(long)*cosD(lat), sinD (long)*cosD(lat), sinD(lat)].map(s => s*coordinates.r);
    }
    static moonPhase(date = new Date(), eciOrigin = [0,0,0]) {
        let moonEci = math.subtract(astro.moonEciFromTime(date), eciOrigin)
        let moonPosition = {
            rightAscension: Math.atan2(moonEci[1], moonEci[0]),
            declination: Math.atan(moonEci[2]/ math.norm(moonEci.slice(0,2)))
        }
        let sunEci = math.subtract(astro.sunEciFromTime(date), eciOrigin)
        let sunPosition = {
            rightAscension: Math.atan2(sunEci[1],  sunEci[0]),
            declination: Math.atan(sunEci[2]/ math.norm(sunEci.slice(0,2)))
        }
        let cosPsi = Math.sin(sunPosition.declination)*Math.sin(moonPosition.declination)+Math.cos(sunPosition.declination)*Math.cos(moonPosition.declination)*Math.cos(sunPosition.rightAscension-moonPosition.rightAscension)
        let cosI = -cosPsi
        let k = (1+cosI)/2
        return k
    }
    static moonPhaseFromAngle(viewPosition=[0,0,0], moonPosition=[1,0,0], sunPosition=[-1,1,0]) {
        // let moonEci = math.subtract(moonPosition, viewPosition)
        // moonPosition = {
        //     rightAscension: Math.atan2(moonEci[1], moonEci[0]),
        //     declination: Math.atan(moonEci[2]/ math.norm(moonEci.slice(0,2)))
        // }
        // let sunEci = math.subtract(sunPosition, viewPosition)
        // sunPosition = {
        //     rightAscension: Math.atan2(sunEci[1],  sunEci[0]),
        //     declination: Math.atan(sunEci[2]/ math.norm(sunEci.slice(0,2)))
        // }
        // let cosPsi = Math.sin(sunPosition.declination)*Math.sin(moonPosition.declination)+Math.cos(sunPosition.declination)*Math.cos(moonPosition.declination)*Math.cos(sunPosition.rightAscension-moonPosition.rightAscension)
        sunPosition = math.subtract(sunPosition, viewPosition)
        moonPosition = math.subtract(moonPosition, viewPosition)
        let cosPsi = math.dot(moonPosition, sunPosition)/math.norm(moonPosition)/math.norm(sunPosition)
        // console.log(math.acos(cosPsi)*180/Math.PI, cosPsi);
        let cosI = -cosPsi
        let k = (1+cosI)/2
        return k
    }
    static moonPhaseFromEci(moonEci, sunEci) {
        let moonPosition = {
            rightAscension: Math.atan2(moonEci[1], moonEci[0]),
            declination: Math.atan(moonEci[2]/ math.norm(moonEci.slice(0,2)))
        }
        let sunPosition = {
            rightAscension: Math.atan2(sunEci[1],  sunEci[0]),
            declination: Math.atan(sunEci[2]/ math.norm(sunEci.slice(0,2)))
        }
        let cosPsi = Math.sin(sunPosition.declination)*Math.sin(moonPosition.declination)+Math.cos(sunPosition.declination)*Math.cos(moonPosition.declination)*Math.cos(sunPosition.rightAscension-moonPosition.rightAscension)
        let cosI = -cosPsi
        let k = (1+cosI)/2
        return k
        console.log(k); 
        let tanXi = (Math.cos(sunPosition.declination)*Math.sin(sunPosition.rightAscension-moonPosition.rightAscension)/(Math.sin(sunPosition.declination)*Math.sin(moonPosition.declination)-Math.cos(sunPosition.declination)*Math.sin(moonPosition.declination)*Math.cos(sunPosition.rightAscension-moonPosition.rightAscension)))
        console.log(tanXi, math.atan(tanXi)*180/Math.PI);
    }
    static sunEciFromTime(date = new Date()) {
        let jdUti = astro.julianDate(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() + date.getMilliseconds())
        let tUti = (jdUti - 2451545) / 36525
        let lamba = 280.4606184 + 36000.770005361 * tUti
        let m = 357.5277233 + 35999.05034 * tUti
        let lambaEll = lamba + 1.914666471 * Math.sin(m* Math.PI / 180) + 0.019994643 * Math.sin(2 * m* Math.PI / 180)
        let phi = 0
        let epsilon = 23.439291-0.0130042 * tUti
        let rSun = 1.000140612-0.016708617 * Math.cos(m * Math.PI / 180)-0.000139589*Math.cos(2*m* Math.PI / 180)
        let au = 149597870.7 //km
        rSun *= au
        return [
           rSun * Math.cos(lambaEll* Math.PI / 180),
           rSun * Math.cos(epsilon* Math.PI / 180) * Math.sin(lambaEll* Math.PI / 180),
           rSun * Math.sin(epsilon* Math.PI / 180) * Math.sin(lambaEll* Math.PI / 180)
        ]
    }
    static meanObliquityOfTheEcliptic(T_tt=0.0426236319) {
        return 23.439291 - 0.0130042*T_tt - (1.64e-7) * T_tt*T_tt+(5.04e-7)*T_tt*T_tt*T_tt
    }
    static trueObliquityOfTheEcliptic(T_tt=0.0426236319) {
        // tbd
    }
    static eci2latlong(r=[5102.508958, 6123.011401, 6378.136928], date=new Date(2004, 3, 6, 7, 51, 28, 386)) {
        // Based on Vallado "Fundamentals of Astrodyanmics and Applications" algorithm 24, p. 228 4th edition
        // ECI to ECEF
        let jd_TT = astro.julianDate(date.getFullYear(), date.getMonth()+1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()+date.getMilliseconds()/1000) 
        let t_TT = (jd_TT - 2451545) / 36525
        let zeta = 2306.2181 * t_TT + 0.30188 * t_TT ** 2 + 0.017998 * t_TT ** 3
        zeta /= 3600
        let theta = 2004.3109 * t_TT - 0.42665 * t_TT ** 2 - 0.041833 * t_TT ** 3
        theta /= 3600
        let z = 2306.2181 * t_TT + 1.09468 * t_TT ** 2 + 0.018203 * t_TT ** 3
        z /= 3600
        let p = math.multiply(astro.rot(zeta, 3), astro.rot(-theta, 2), astro.rot(z, 3))

        let thetaGmst = astro.siderealTime(jd_TT)
        let w = astro.rot(-thetaGmst, 3)
        let overallR = math.multiply(math.transpose(w), math.transpose(p))
        r = math.squeeze(math.multiply(overallR, math.transpose([r])))
        let long = math.atan2(r[1], r[0])
        let lat = math.atan2(r[2], math.norm(r.slice(0,2)))
        return {lat, long, rot: overallR, r_ecef: r}
    }
    static latlong2eci(lat = 0, long = 0, date = new Date()) {
        let rEcef = astro.sensorGeodeticPosition(lat, long, 0)
        return astro.ecef2eci(rEcef, date)
    }
    static latlongrange2eci(lat = 0, long = 0, date = new Date(), h = 0) {
        let rEcef = astro.sensorGeodeticPosition(lat, long, h)
        return astro.ecef2eci(rEcef, date)
    }
    static eci2ecef(r=[5102.508958, 6123.011401, 6378.136928], date=new Date(2004, 3, 6, 7, 51, 28, 386)) {
        // Based on Vallado "Fundamentals of Astrodyanmics and Applications" algorithm 24, p. 228 4th edition
        // ECI to ECEF
        let jd_TT = astro.julianDate(date.getFullYear(), date.getMonth()+1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()+date.getMilliseconds()/1000) 
        let t_TT = (jd_TT - 2451545) / 36525
        let zeta = 2306.2181 * t_TT + 0.30188 * t_TT ** 2 + 0.017998 * t_TT ** 3
        zeta /= 3600
        let theta = 2004.3109 * t_TT - 0.42665 * t_TT ** 2 - 0.041833 * t_TT ** 3
        theta /= 3600
        let z = 2306.2181 * t_TT + 1.09468 * t_TT ** 2 + 0.018203 * t_TT ** 3
        z /= 3600
        let p = math.multiply(astro.rot(zeta, 3), astro.rot(-theta, 2), astro.rot(z, 3))

        let thetaGmst = astro.siderealTime(jd_TT)
        let w = astro.rot(-thetaGmst, 3)
        let overallR = math.multiply(math.transpose(w), math.transpose(p))
        return math.squeeze(math.multiply(overallR, math.transpose([r])))
    }
    static groundGeodeticPosition(lat = 39.586667, long = -105.64, h = 4.347667) {
        lat *= 0.017453292519943295 // Convert to radians
    
        let eEarth2 = 0.006694385
        let rEarth = 6378.1363
        let sinLat = Math.sin(lat)
        let c = (1 - eEarth2 * sinLat ** 2) ** 0.5
        let cEarth = rEarth / c
        let sEarth = rEarth * (1 - eEarth2) / c
        
        let rSigma = (cEarth + h) * Math.cos(lat)
        let rk = (sEarth + h) * sinLat
        // console.log(rSigma, rk / math.tan(lat));
        let r = math.squeeze(math.multiply(astro.rot(-long, 3),math.transpose([[rSigma, 0, rk]])));
        let rij = math.dotDivide(r.slice(0,2) , math.norm(r.slice(0,2)) /(rk / math.tan(lat)))
        // console.log(rij, r);
        return {r, vert: [...rij, r[2]]};
        
    }
    static rAzEl(r_eci=[-5505.504883, 56.449170, 3821.871726], date=new Date(1995, 4, 20, 3, 17, 2), lat=39.007, long=-104.883, h = 2.187) {
        let r_ecef = astro.eci2ecef(r_eci, date)
        let r_site_ecef = astro.groundGeodeticPosition(lat, long, h).r
        let rho = math.transpose([math.subtract(r_ecef, r_site_ecef)])
        lat *= Math.PI / 180
        long*= Math.PI / 180
        let r = [[Math.sin(lat) * Math.cos(long), -Math.sin(long), Math.cos(lat) * Math.cos(long)],
                 [Math.sin(lat) * Math.sin(long), Math.cos(long), Math.cos(lat) * Math.sin(long)],
                 [-Math.cos(lat), 0, Math.sin(lat)]]
        rho = math.squeeze(math.multiply(math.transpose(r), rho))
        let el = Math.asin(rho[2] / math.norm(rho)) * 180 / Math.PI
        let az = Math.atan2(rho[1], -rho[0]) * 180 / Math.PI
        r = math.norm(rho)
        return {el, az, r}
    }
    static v2az(v = [7, 0, 0], date = new Date(1995, 4, 20, 3, 17, 2), lat = 0, long = 0) {
        let v_ecef = astro.eci2ecef(v, date)
        lat *= Math.PI / 180
        long*= Math.PI / 180
        let r = [[Math.sin(lat) * Math.cos(long), -Math.sin(long), Math.cos(lat) * Math.cos(long)],
                 [Math.sin(lat) * Math.sin(long), Math.cos(long), Math.cos(lat) * Math.sin(long)],
                 [-Math.cos(lat), 0, Math.sin(lat)]]
        let v_topo = math.squeeze(math.multiply(math.transpose(r), v_ecef))
        // console.log(v_topo);
        let az = Math.atan2(v_topo[1], -v_topo[0]) * 180 / Math.PI
        return az
    }
    static ecef2eci(r=[-1033.479383, 7901.2952754, 6380.3565958], date=new Date(2004, 3, 6, 7, 51, 28,328)) {
        // Based on Vallado "Fundamentals of Astrodyanmics and Applications" algorithm 24, p. 228 4th edition
        // ECI to ECEF
        let jd_UTI = astro.julianDate(date.getFullYear(), date.getMonth()+1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()+date.getMilliseconds()/1000) 
        let t_TT = (jd_UTI - 2451545) / 36525
        let zeta = 2306.2181 * t_TT + 0.30188 * t_TT ** 2 + 0.017998 * t_TT ** 3
        zeta /= 3600
        let theta = 2004.3109 * t_TT - 0.42665 * t_TT ** 2 - 0.041833 * t_TT ** 3
        theta /= 3600
        let z = 2306.2181 * t_TT + 1.09468 * t_TT ** 2 + 0.018203 * t_TT ** 3
        z /= 3600
        let p = math.multiply(astro.rot(zeta, 3), astro.rot(-theta, 2), astro.rot(z, 3))
        let thetaGmst = astro.siderealTime(jd_UTI)
        // Figure out why theta doesn't match
        // thetaGmst = 312.8067654
        let w = astro.rot(-thetaGmst, 3)
        r = math.multiply(w, r) 
        r = math.multiply(p, r)
        return r
    }
    static j20002Coe(state = [42164.14, 0, 0, 0, 3.0746611796284924, 0]) {
        let r = state.slice(0,3), v = state.slice(3,6)
        let mu = 398600.4418
        let rn = math.norm(r)
        let vn = math.norm(v)
        let h = math.cross(r,v)
        let hn = math.norm(h)
        let n = math.cross([0,0,1], h)
        let e = math.dotDivide(math.subtract(math.dotMultiply(vn ** 2 - mu / rn, r), math.dotMultiply(math.dot(r, v), v)), mu)
        let en = math.norm(e)
        let specMechEn = vn ** 2 / 2 - mu / rn
        let a = -mu / 2 / specMechEn
        let i = math.acos(h[2] / hn)
        let raan = math.acos(n[0] / math.norm(n))
        if (n[1] < 0) {
            raan = 2 * Math.PI - raan
        }
        let arg = math.acos(math.dot(n, e) / math.norm(n) / en)
        if (arg.re !== undefined) {
            arg = arg.re
        }
        if (e[2] < 0) {
            arg = 2 * Math.PI - arg
        }
        let tA = math.acos(math.dot(e, r) / en / rn)
        if (tA.re !== undefined) {
            tA = tA.re
        }
        if (math.dot(r, v) < 0) {
            tA = 2 * Math.PI - tA
        }
        let longOfPeri, argLat, trueLong
        if (en < 1e-6 && i < 1e-6) {
            trueLong = math.acos(r[0] / rn)
            if (r[1] < 0) {
                trueLong = 2 * Math.PI - trueLong
            }
            arg = 0
            raan = 0
            tA = trueLong 
        }
        else if (en < 1e-6) {
            argLat = math.acos(math.dot(n, r) / math.norm(n) / rn)
            if (r[2] < 0) {
                argLat = 2 * Math.PI - argLat
            }
            arg = 0
            tA = argLat
        }
        else if (i < 1e-6) {
            longOfPeri = math.acos(e[0] / en)
            if (e[1] < 0) {
                longOfPeri = 2 * Math.PI - longOfPeri
            }
            raan = 0
            arg = longOfPeri
        }
        return {
            a,
            e: en,
            i,
            raan,
            arg,
            tA
        };
    }
    static coe2J2000(coe = {a: 42164.1401, e: 0, i: 0, raan: 0, arg: 0, tA: 0}, peri = false) {
        let p = coe.a * (1 - coe.e * coe.e);
        let cTa = Math.cos(coe.tA);
        let sTa = Math.sin(coe.tA);
        let r = [
            [p * cTa / (1 + coe.e * cTa)],
            [p * sTa / (1 + coe.e * cTa)],
            [0]
        ];
        let constA = Math.sqrt(398600.4418 / p);
        let v = [
            [-constA * sTa],
            [(coe.e + cTa) * constA],
            [0]
        ];
        if (peri) return [
            r[0],
            r[1],
            r[2],
            v[0],
            v[1],
            v[2]
        ].map(s => s[0])
        let cRa = Math.cos(coe.raan);
        let sRa = Math.sin(coe.raan);
        let cAr = Math.cos(coe.arg);
        let sAr = Math.sin(coe.arg);
        let cIn = Math.cos(coe.i);
        let sin = Math.sin(coe.i);
        let R = [
            [cRa * cAr - sRa * sAr * cIn, -cRa * sAr - sRa * cAr * cIn, sRa * sin],
            [sRa * cAr + cRa * sAr * cIn, -sRa * sAr + cRa * cAr * cIn, -cRa * sin],
            [sAr * sin, cAr * sin, cIn]
        ];
        r = math.multiply(R, r);
        v = math.multiply(R, v);
        return [
            r[0],
            r[1],
            r[2],
            v[0],
            v[1],
            v[2]
        ].map(s => s[0])
    }
    static sensorGeodeticPosition(lat = 39.586667, long = -105.64, h = 4.347667) {
        lat *= Math.PI / 180
    
        // let eEarth = 0.081819221
        let eEarth = 0.006694385 ** 0.5
        let rEarth = 6378.1363
        let rFocus = eEarth * rEarth
    
        let cEarth = rEarth / (1 - eEarth ** 2 * Math.sin(lat) ** 2) ** 0.5
        let sEarth = rEarth * (1 - eEarth ** 2) / (1 - eEarth ** 2 * Math.sin(lat) ** 2) ** 0.5
        
        let rSigma = (cEarth + h) * Math.cos(lat)
        let rk = (sEarth + h) * Math.sin(lat)
        return math.squeeze(math.multiply(astro.rot(-long, 3),math.transpose([[rSigma, 0, rk]])));
        
    }
    static ConvEciToRic(chief_eci, deputy_eci, returnRot = false) {
        let rC = chief_eci.slice(0,3), drC = chief_eci.slice(3,6), rD = deputy_eci.slice(0,3), drD = deputy_eci.slice(3,6)
        let h = math.cross(rC, drC);
        let ricX = math.dotDivide(rC, math.norm(rC));
        let ricZ = math.dotDivide(h, math.norm(h));
        let ricY = math.cross(ricZ, ricX);
    
        let ricXd = math.dotMultiply(1 / math.norm(rC), math.subtract(drC, math.dotMultiply(math.dot(ricX, drC), ricX)));
        let ricYd = math.cross(ricZ, ricXd);
        let ricZd = [0,0,0];
    
        let C = [ricX, ricY, ricZ];
        let Cd = [ricXd, ricYd, ricZd];
        if (returnRot) return [C, Cd]
        return [
            ...math.squeeze(math.multiply(C, math.transpose([math.subtract(rD, rC)]))),
            ...math.squeeze(math.add(math.multiply(Cd, math.transpose([math.subtract(rD, rC)])), math.multiply(C, math.transpose([math.subtract(drD, drC)]))))
        ]
    }
    static Eci2Ric(chief, deputy) {
        let rC = chief.slice(0,3), drC = chief.slice(3,6)
        let rD = deputy.slice(0,3), drD = deputy.slice(3,6)
        let h = math.cross(rC, drC);
        let ricX = math.dotDivide(rC, math.norm(rC));
        let ricZ = math.dotDivide(h, math.norm(h));
        let ricY = math.cross(ricZ, ricX);
    
        let ricXd = math.dotMultiply(1 / math.norm(rC), math.subtract(drC, math.dotMultiply(math.dot(ricX, drC), ricX)));
        let ricYd = math.cross(ricZ, ricXd);
        let ricZd = [0,0,0];
    
        let C = [ricX, ricY, ricZ];
        let Cd = [ricXd, ricYd, ricZd];
        return math.squeeze([
            ...math.multiply(C, math.transpose([math.subtract(rD, rC)])),
            ...math.add(math.multiply(Cd, math.transpose([math.subtract(rD, rC)])), math.multiply(C, math.transpose([math.subtract(drD, drC)])))
        ])
    }
    static pointRadialDistance(lat1 = 0,lon1 = 0,bearing = 10,rdistance = 5) {
        // Assumes degrees
        let rlat1 = lat1*Math.PI/180;
        let rlon1 = lon1*Math.PI/180;
        let rbearing = bearing*Math.PI/180;
        rdistance = rdistance*Math.PI/180;
        let rlat = Math.asin( Math.sin(rlat1) * Math.cos(rdistance) + Math.cos(rlat1) * Math.sin(rdistance) * Math.cos(rbearing) );
        let rlon
        if (Math.cos(rlat) == 0 || Math.abs(Math.cos(rlat)) < 0.000001) {
            rlon=rlon1;
        }
        else{
            rlon = rlon1 + Math.atan2(Math.sin(rbearing)*Math.sin(rdistance)*Math.cos(rlat1),Math.cos(rdistance)-Math.sin(rlat1)*Math.sin(rlat));
        }
        let lat = rlat*180/Math.PI;
        let lon = rlon*180/Math.PI;
        // console.log(lon)
        if (lon < -180) {
            lon += 360;
        }
        else if (lon > 180) {
            lon -= 360;
        }
        return [lat,lon];
    }
    static groundSwath(radius,deg = true) {
        if (deg){
            return Math.acos(6371/radius)*180/Math.PI;
        }
        else {
            return Math.acos(6371/radius);
        }
    }
    static eccentric2True(eccAnom, e) {
        return Math.atan(Math.sqrt((1+e)/(1-e))*Math.tan(eccAnom/2))*2;
    }
    static solveKeplersEquation(meanAnom,e) {
        let eccAnom = meanAnom;
        let del = 1;
        while (Math.abs(del) > 1e-6) {
            del = (eccAnom-e*Math.sin(eccAnom)-meanAnom)/(1-e*Math.cos(eccAnom));
            eccAnom -= del;
        }
        return eccAnom;
    }
    static toStkDateFormat(date) {
        let time = date.toString()
        time = time.split('GMT')[0].substring(4, time.split('GMT')[0].length - 1) + '.000';
        time = time.split(' ');
        return time[1] + ' ' + time[0] + ' ' + time[2] + ' ' + time[3];
    }
    static choleskyDecomposition(matrix = [[25, 15, -5],[15, 18,  0],[-5,  0, 11]]) {
        let a = math.zeros([matrix.length, matrix.length])    
        for (let ii = 0; ii < a.length; ii++) {
            for (let jj = 0; jj <= ii; jj++) {
                if (ii === jj) {
                    a[ii][jj] = matrix[ii][jj]
                    let subNumber = 0
                    for (let kk = 0; kk < jj; kk++) {
                        subNumber += a[jj][kk] ** 2
                    }
                    a[ii][jj] -= subNumber
                    a[ii][jj] = a[ii][jj] ** (1/2)
                }
                else {
                    a[ii][jj] = matrix[ii][jj]
                    let subNumber = 0
                    for (let kk = 0; kk < jj; kk++) {
                        subNumber += a[ii][kk] * a[jj][kk]
                    }
                    a[ii][jj] -= subNumber
                    a[ii][jj] *= 1 / a[jj][jj]
                }
            }
        }
        return a
    }
    static dateToTT(d = new Date()) {
        d = new Date(d - (-69*1000))
        d = astro.julianDate(d.getFullYear(), d.getMonth()+1, d.getHours(), d.getMinutes(), d.getSeconds())
        d = (d - 2451454)/36525
        return d
    }
    static teme2eci(rteme = [42164,0,0], vteme = [0,3.0140,0], date= new Date(), ddpsi, ddeps) {
        date = new Date(date - (-69*1000))
        date = astro.julianDate(date.getFullYear(), date.getMonth()+1, date.getHours(), date.getMinutes(), date.getSeconds()+date.getMilliseconds())
        let ttt = (date - 2451454)/36525
        let prec= astro.precess(ttt, '80')
        let tm = prec
        return [...math.multiply(tm, rteme), ...math.multiply(tm, vteme)]
    }
    static precess(ttt) {
        let convrt = Math.PI / 180/3600
        let ttt2 = ttt**2
        let ttt3 = ttt**3
        let psia = 5038.7784*ttt - 1.07259*ttt2 - 0.001147*ttt3
        let wa = 84381.448 + 0.05124*ttt2 - 0.007726*ttt3
        let ea = 84381.448 - 46.815*ttt - 0.00059*ttt2 + 0.001813*ttt3
        let xa = 10.5526*ttt - 2.38064*ttt2 - 0.001125*ttt3
        let zeta = 2306.2181*ttt + 0.30188*ttt2 + 0.017998*ttt3
        let theta = 2004.3109*ttt - 0.42665*ttt2 - 0.041833*ttt3
        let z = 2306.2181*ttt + 1.09468*ttt2 + 0.018203*ttt3
        psia *= convrt
        wa *= convrt
        ea *= convrt
        xa *= convrt
        zeta *= convrt
        theta *= convrt
        z *= convrt
        let cosZeta = Math.cos(zeta)
        let sinZeta = Math.sin(zeta)
        let sinTheta = Math.sin(theta)
        let cosTheta = Math.cos(theta)
        let sinZ = Math.sin(z)
        let cosZ = Math.cos(z)
        return [[cosZeta*cosTheta*cosZ-sinZeta*sinZ, cosZeta*cosTheta*sinZ+sinZeta*cosZ, cosZeta*sinTheta],
                    [-sinZeta*cosTheta*cosZ-cosZeta*sinZ, -sinZeta*cosTheta*sinZ+cosZeta*cosZ, -sinZeta*sinTheta],
                    [-sinTheta*cosZ, -sinTheta*sinZ, cosTheta]]
    }
}

class Propagator {
    constructor(options = {}) {
        let {
            order = 8,
            atmDrag = true,
            solarRad = true,
            thirdBody = true,
            mass = 850,
            srbarea = 1,
            cd = 2.2,
            cr = 1.8,
            area = 15,
            minAtDrag = 85
        } = options
        this.storeCoefficients()
        this.mass = mass,
        this.cd = cd
        this.cr = cr
        this.area = area
        this.srparea = srbarea
        this.order = order
        this.atmDrag = atmDrag
        this.solarRad = solarRad
        this.thirdBody = thirdBody
        this.minAtDrag = minAtDrag
    }
    highPrecisionProp(position = [6371, 0, 0, 0, 7.909, 0], date = new Date(), burnAcc = [0,0,0]) {
        let r = math.norm(position.slice(0,3))
        let a = math.dotMultiply(-398600.4415 /r/r/r, position.slice(0,3))
        // console.time('geo')
        a = math.add(this.recursiveGeoPotential(position, date).a,a)
        // console.timeEnd('geo')

        // console.time('3B')
        if (this.thirdBody) {a = math.add(this.thirdBodyEffects(position, date),a)}
        // console.timeEnd('3B')

        // console.time('atm')
        if (this.atmDrag) {a = math.add(this.atmosphericDragEffect(position),a)}
        // console.timeEnd('atm')
        
        // console.time('solarRad')
        if (this.solarRad) {a = math.add(this.solarRadiationPressure(position, date),a)}
        // console.timeEnd('solarRad')
        if (math.norm(burnAcc) > 1e-8) {
            let c = astro.ConvEciToRic(position, [0,0,0,0,0,0], true)[0]
            burnAcc = math.multiply(math.transpose(c), burnAcc)
            a = math.add(burnAcc,a)
        }

        return [position[3], position[4], position[5],...a]
    }
    recursiveGeoPotential(state=[42164, 0, 0], date) {
        let {lat, long, rot, r_ecef} = astro.eci2latlong(state.slice(0,3), date)
        rot = math.transpose(rot)
        let re = 6378.1363, r = math.norm(state.slice()), x = r_ecef[0], y=r_ecef[1], z=r_ecef[2]
        let cosLat = Math.cos(lat), sinLat = Math.sin(lat)
        let cosLong = Math.cos(long)
        let sinArray = [0,Math.sin(long)]
        let cosArray = [1,cosLong]
        let tanLat = Math.tan(lat)
        let mTanArray = [0, tanLat]
        let re_r = re/r
        let rArray = [1, re_r]
        for (let index = 2; index <= this.order; index++) {
            sinArray.push(2*cosLong*sinArray[index-1]-sinArray[index-2])
            cosArray.push(2*cosLong*cosArray[index-1]-cosArray[index-2])  
            mTanArray.push((index-1)*tanLat+tanLat)
            rArray.push(rArray[index-1]*re_r)
        }
        let du_dr = 0, du_dlat = 0, du_dlong = 0
        let pMat = [[1],[sinLat, cosLat]]
        for (let order = 2; order <= this.order; order++) {
            let pRow = []
            for (let m = 0; m <= order; m++) {
                if (m === 0) pRow.push(((2*order-1)*sinLat*pMat[order-1][0] - (order-1)*pMat[order-2][0])/order)
                else if (m === order) pRow.push((2*order-1)*cosLat*pMat[order-1][order-1])
                else {
                    let po_2m = m > (order-2) ? 0 : pMat[order-2][m]
                    pRow.push(po_2m + (2*order-1)*cosLat*pMat[order-1][m-1])
                }
                let pMpl1
                if ((m+1) === order) {pMpl1 = (2*order-1)*cosLat*pMat[order-1][order-1]}
                else {
                    let po_2m = (m+1) > (order-2) ? 0 : pMat[order-2][m+1]
                    pMpl1 = po_2m + (2*order-1)*cosLat*pMat[order-1][m]
                }
                pMpl1 = (m+1) > order ? 0 : pMpl1
                let pM = pRow[pRow.length-1]
                
                du_dr += rArray[order]*(order+1)*pM*(this.c[order][m]*cosArray[m]+this.s[order][m]*sinArray[m])
    
                du_dlat += rArray[order] * (pMpl1 - mTanArray[m] * pM) * (this.c[order][m]*cosArray[m] + this.s[order][m]*sinArray[m])
                
                du_dlong += rArray[order]* m * pM * (this.s[order][m]*cosArray[m] - this.c[order][m]*sinArray[m])
            }
            pMat.push(pRow)
        }
        du_dr *= -398600.4418/r/r
    
        du_dlat *= 398600.4418/r
    
        du_dlong *= 398600.4418/r
    
        let a_i = (1/r * du_dr - z/r/r/Math.sqrt(x*x+y*y)*du_dlat)*x - (1/(x*x+y*y)*du_dlong)*y
        let a_j = (1/r * du_dr - z/r/r/Math.sqrt(x*x+y*y)*du_dlat)*y + (1/(x*x+y*y)*du_dlong)*x
        let a_k = 1/r * du_dr * z + Math.sqrt(x*x+y*y)/r/r * du_dlat
    
        return {pMat, a: math.squeeze(math.multiply(rot, math.transpose([[a_i, a_j, a_k]])))}  
    }
    rk4(state = [42164, 0, 0, 0, -3.070, 0], dt = 10, date = new Date()) {
        let k1 = this.highPrecisionProp(state, date);
        let k2 = this.highPrecisionProp(math.add(state, math.dotMultiply(dt/2, k1)), new Date(date - (-dt / 2 * 1000)));
        let k3 = this.highPrecisionProp(math.add(state, math.dotMultiply(dt/2, k2)), new Date(date - (-dt / 2 * 1000)));
        let k4 = this.highPrecisionProp(math.add(state, math.dotMultiply(dt/1, k3)), new Date(date - (-dt * 1000)));
        return math.squeeze(math.add(state, math.dotMultiply(dt / 6, (math.add(k1, math.dotMultiply(2, k2), math.dotMultiply(2, k3), k4)))));
    }
    thirdBodyEffects(eciState = state1_init, date = state1_init_Epoch) {
        //Moon
        let moonVector = astro.moonEciFromTime(date)
        let muMoon = 4902.799
        let moonSatVec = math.subtract(moonVector, eciState.slice(0,3))
        let rEarthMoon = math.norm(moonVector)
        let rSatMoon = math.norm(moonSatVec)
        let rSatMoon3 = rSatMoon**3
        let rEarthMoon3 = rEarthMoon**3
        let aMoon = [
            muMoon*(moonSatVec[0] / rSatMoon3 - moonVector[0]/rEarthMoon3),
            muMoon*(moonSatVec[1] / rSatMoon3 - moonVector[1]/rEarthMoon3),
            muMoon*(moonSatVec[2] / rSatMoon3 - moonVector[2]/rEarthMoon3),
        ]
        //Sun
        let sunVector = astro.sunEciFromTime(date)
        let muSun = 1.32712428e11
        let sunSatVec = math.subtract(sunVector, eciState.slice(0,3))
        let rEarthSun = math.norm(sunVector)
        let rSatSun = math.norm(sunSatVec)
        let rEarthSun3 = rEarthSun**3
        let rSatSun3 = rSatSun**3
        let aSun = [
            muSun*(sunSatVec[0] / rSatSun3 - sunVector[0]/rEarthSun3),
            muSun*(sunSatVec[1] / rSatSun3 - sunVector[1]/rEarthSun3),
            muSun*(sunSatVec[2] / rSatSun3 - sunVector[2]/rEarthSun3),
        ]
        return math.add(aMoon, aSun)
    }
    atmosphericDragEffect(eciState = state2_init, options = {}) {
        let {cd = this.cd, m = this.mass, area = this.area} = options
        let re = 6378.137
        let r = math.norm(eciState.slice(0,3))
        let h = r - re
        let rho = this.getAtmosphereDensity(h)
        let rotEarth = [0,0,2*Math.PI /86164]
        let vrel = math.subtract(eciState.slice(3,6), math.cross(rotEarth, eciState.slice(0,3))).map(s => s*1000)
        let vrelmag = math.norm(vrel)
    
        return math.dotMultiply(-0.5*cd*area*rho*vrelmag/m, vrel).map(s => s / 1000)
    }
    getAtmosphereDensity(h = 747.2119) {
        // Based off of Table 8-4 in Fundamentals of Astrodynamics by Vallado 2nd Ed.
        h = h < this.minAtDrag ? this.minAtDrag : h
        let atData = [
            [0,1.225,7.249],
            [25,3.899e-2,6.349],
            [30,1.774e-2,6.6582],
            [40,3.972e-3,7.554],
            [50,1.057e-3,8.382],
            [60,3.206e-4,7.714],
            [70,8.770e-5,6.549],
            [80,1.905e-5,5.799],
            [90,3.396e-6,5.382],
            [100,5.297e-7,5.877],
            [110,9.661e-8,7.263],
            [120,2.438e-8,9.473],
            [130,8.484e-9,12.636],
            [140,3.845e-9,16.149],
            [150,2.070e-9,22.523],
            [180,5.464e-10,29.740],
            [200,2.789e-10,37.105],
            [250,7.248e-11,45.546],
            [300,2.418e-11,53.628],
            [350,9.158e-12,53.298],
            [400,3.725e-12,58.515],
            [450,1.585e-12,60.828],
            [500,6.967e-13,63.822],
            [600,1.454e-13,71.835],
            [700,3.614e-14,88.667],
            [800,1.170e-14,124.64],
            [900,5.245e-15,181.05],
            [1000,3.019e-15,268.00]
        ]
    
        let dataRow = atData.findIndex(a => a[0] > h)-1
        if (dataRow < 0) {
            dataRow = atData.length - 1
        }
        return atData[dataRow][1]*Math.exp(-(h - atData[dataRow][0])/atData[dataRow][2])   
    }
    solarRadiationPressure(state = state1_init, date = state1_init_Epoch, options = {}) {
        let {mass = this.mass, area = this.srparea, cr = this.cr} = options
        let sunEci = astro.sunEciFromTime(date)
        let p_srp = 4.57e-6
        let rSunSat = math.subtract(sunEci, state.slice(0,3))
    
        let a = -p_srp * cr * area / mass / math.norm(rSunSat) / 1000
    
        return math.dotMultiply(a, rSunSat)
    }
    propToTimeHistory(state, date, tf = 86400, maxError = 1e-9) {
        let h = 500
        h = h > tf ? tf : h
        let t = 0
        let stateReturn = [{
            date: new Date(date - (-t*1000)),
            state: state.slice()
        }]
        while ((t+h) <= tf) {
            let rkResult = this.rkf45(state, new Date(date - (-1000*t)), h, maxError)
            state = rkResult.y
            h = rkResult.hnew
            t += rkResult.dt
            if (rkResult.dt > 0) {
                stateReturn.push({
                    date: new Date(date - (-t*1000)),
                    state: state.slice()
                })
            }
        }
        let rkResult = this.rkf45(state, new Date(date - (-1000*t)), tf - t, 1)
        state = rkResult.y
        stateReturn.push({
            date: new Date(date - (-tf*1000)),
            state: state.slice()
        })
        return stateReturn
    }
    propToTime(state = [6371,0,0,0,(398600.4418/6371)**0.5,0], date = new Date(2022,0,0), tf = 7200, options = {}) {
        let {maxError = 1e-3, a = [0,0,0]} = options
        let h = tf > 0 ? 500 : -500
        h = Math.abs(h) > Math.abs(tf) ? tf : h
        let t = 0
        while (Math.abs(t+h) <= Math.abs(tf)) {
            let rkResult = this.rkf45(state, new Date(date - (-1000*t)), h, maxError, {a})
            state = rkResult.y
            h = rkResult.hnew
            t += rkResult.dt
        }
        let rkResult = this.rkf45(state, new Date(date - (-1000*t)), tf - t, 1, {a})
        state = rkResult.y
        return {state, date: new Date(date - (-1000*tf))}
    }
    rkf45(state, time, h = 2000, epsilon = 1e-12, options = {}) {
        let {a = [0,0,0]} = options
        let k1 = math.dotMultiply(h, this.highPrecisionProp(state, time, a))
        let k2 = math.dotMultiply(h, this.highPrecisionProp(math.add(state,math.dotMultiply(2/9,k1)), new Date(time - (-1000*h*2/9)), a))
        let k3 = math.dotMultiply(h, this.highPrecisionProp(math.add(state,math.dotMultiply(1/12,k1),math.dotMultiply(1/4,k2)), new Date(time - (-1000*h/3)), a))
        let k4 = math.dotMultiply(h, this.highPrecisionProp(math.add(state,math.dotMultiply(69/128,k1),math.dotMultiply(-243/128,k2),math.dotMultiply(135/64,k3)), new Date(time - (-1000*h*3/4)), a))
        let k5 = math.dotMultiply(h, this.highPrecisionProp(math.add(state,math.dotMultiply(-17/12,k1),math.dotMultiply(27/4,k2),math.dotMultiply(-27/5,k3),math.dotMultiply(16/15,k4)), new Date(time - (-1000*h)), a))
        let k6 = math.dotMultiply(h, this.highPrecisionProp(math.add(state,math.dotMultiply(65/432,k1),math.dotMultiply(-5/16,k2),math.dotMultiply(13/16,k3),math.dotMultiply(4/27,k4),math.dotMultiply(5/144,k5)), new Date(time - (-1000*h*5/6)), a))
        let y = math.add(state, math.dotMultiply(47/450, k1), math.dotMultiply(12/25, k3), math.dotMultiply(32/225, k4), math.dotMultiply(1/30, k5), math.dotMultiply(6/25, k6))
        
        let te = math.norm(math.add(math.dotMultiply(-1/150, k1), math.dotMultiply(3/100, k3), math.dotMultiply(-16/75, k4), math.dotMultiply(-1/20, k5), math.dotMultiply(6/25, k6)))
        
        let hnew = 0.9*h*(epsilon/te)**0.2
        if (te > epsilon) {
            y = state
            h = 0
        }
        return {y, hnew, dt: h, te}
    }
    storeCoefficients() {
        this.c = math.zeros([71, 71])
        this.s = math.zeros([71, 71])
        EGM_96_NORMALIZED.forEach(row => {
            let order = row[0], m = row[1], k = row[1] === 0 ? 1 : 2
            let normalizingFactor = (math.factorial(order+m)/math.factorial(order-m)/k/(2*order+1)) ** 0.5
            this.c[row[0]][row[1]] = row[2]/normalizingFactor
            this.s[row[0]][row[1]] = row[3]/normalizingFactor
        })
    }
}

class Launch {
    static estTofToApogee(siteECI, satECI) {
        function True2Eccentric(e, ta) {
            return Math.atan(Math.sqrt((1 - e) / (1 + e)) * Math.tan(ta / 2)) * 2;
        }
        let range = math.norm(math.subtract(siteECI, satECI.slice(0,3)))
        let siteECIn = math.norm(siteECI.slice(0,3))
        let satECIn = math.norm(satECI.slice(0,3))
        // let ang = math.dot(siteECI, satECI.slice(0,3)) / siteECIn / satECIn
        let per = (siteECIn+range) * 0.01
        let estA = (satECIn + per) / 2 
        let estE = (range+satECIn - per) / (range+satECIn + per)
        let n = (398600.4418 / estA ** 3) ** 0.5
        let p = estA * (1 - estE ** 2)
        let nu = math.acos((p / siteECIn - 1) / estE)
        let eccA = True2Eccentric(estE, nu)
        let meanA = eccA - estE * Math.sin(eccA)
        let tof = (Math.PI - meanA) / n
        // console.log({estE, estA, n,p,nu,eccA, meanA, tof});
        return tof
    }
    static findApogeeRendezvous(siteEci, targetStart, estimateTof = 7200) {
        try {
            // let crossVector = math.cross(siteEci.slice(0,3),targetStart.slice(0,3))
            // let long = crossVector[2] > 0
            let tof1 = estimateTof - estimateTof*0.1
            let tof2 = estimateTof
            let tof3 = estimateTof + estimateTof*0.1
            let target1 = propToTime(targetStart, tof1)
            let target2 = propToTime(targetStart, tof2)
            let target3 = propToTime(targetStart, tof3)
            let solution1 = solveLambertsProblem(siteEci, target1.slice(0,3), tof1, 0, true)
            let el = 90-math.acos(math.dot(siteEci, solution1.v1) / math.norm(siteEci) / math.norm(solution1.v1))*180/Math.PI
            if (el < 0) {
                return false
            }
            let solution2 = solveLambertsProblem(siteEci, target2.slice(0,3), tof2, 0, true)
            let solution3 = solveLambertsProblem(siteEci, target3.slice(0,3), tof3, 0, true)
        
            let dot1 = math.dot(solution1.v2, target1.slice(0,3))
            let dot2 = math.dot(solution2.v2, target2.slice(0,3))
            let dot3 = math.dot(solution3.v2, target3.slice(0,3))
            let dotPoly = Launch.lagrangePolyCalc([tof1, tof2, tof3], [dot1, dot2, dot3]);
            let dDotPoly = Launch.derivateOfPolynomial(dotPoly)
            let ddDotPoly = Launch.derivateOfPolynomial(dDotPoly)
            // tof2 -= answerPolynomial(dotPoly, tof2) / answerPolynomial(dDotPoly, tof2)
            tof2 -= 2*Launch.answerPolynomial(dotPoly, tof2)*Launch.answerPolynomial(dDotPoly, tof2) / (2*Launch.answerPolynomial(dDotPoly, tof2)**2-Launch.answerPolynomial(dotPoly, tof2)*Launch.answerPolynomial(ddDotPoly, tof2))
            console.log(estimateTof, tof2, dot2, Launch.answerPolynomial(dotPoly, tof2));
            if (dot2 < Launch.answerPolynomial(dotPoly, tof2)) throw Error('Apogee not found exact')
            return tof2
        } catch (error) {
            console.error(error);
            return estimateTof
        }
    }
    static lagrangePolyCalc(x = [0,1,3], y = [1,-2,4]) {
        let answerLength = x.length
        let answer = math.zeros([answerLength])
        for (let ii = 0; ii < x.length; ii++) {
            let subAnswer = [], subAnswerDen = 1
            for (let jj = 0; jj < x.length; jj++) {
                if (ii === jj) continue
                subAnswer.push([1, -x[jj]])
                subAnswerDen *= x[ii] - x[jj]
            }
            subAnswer = subAnswer.slice(1).reduce((a,b) => {
                return multiplyPolynomial(a,b)
            }, subAnswer[0])
            answer = math.add(answer, math.dotMultiply(y[ii] / subAnswerDen, subAnswer))
        }
        return answer
    }
    static multiplyPolynomial(a = [1,3,1], b = [0,2,1]) {
        let aL = a.length, bL = b.length
        let minLength = aL < bL ? bL : aL
        while (a.length < minLength) a.unshift(0)
        while (b.length < minLength) b.unshift(0)
        let answerLength = (minLength - 1) * 2 + 1
        let answer = math.zeros([answerLength])
        for (let index = 0; index < minLength; index++) {
            let subAnswer = math.zeros([answerLength])
            let indexAnswer = math.dotMultiply(a[index], b)
            subAnswer.splice(index, minLength, ...indexAnswer)
            answer = math.add(answer, subAnswer)
        }
        while (answer[0] === 0) answer.shift()
        return answer
    }
    static answerPolynomial(poly = [1,-1,2], x = 4) {
        let p = poly.slice()
        return p.reverse().reduce((a,b,ii) => {
            return a + b * x ** ii
        },0)
    }  
    static derivateOfPolynomial(poly = [3,2,1]) {
        let ddp = poly.slice()
        ddp.pop()
        ddp = ddp.map((p, ii) => {
            return p * (ddp.length - ii)
        })
        return ddp
    }
    static isSatIlluminated(satPos = [6900, 0, 0], sunPos = [6900000, 0,0]) {
        let satSunAngle = math.acos(math.dot(satPos.slice(0,3), sunPos)/math.norm(satPos.slice(0,3))/math.norm(sunPos))
        if (satSunAngle < Math.PI / 2) return true
        return !Launch.lineSphereIntercetionBool(math.subtract(satPos.slice(0,3),sunPos), sunPos, [0,0,0], 6371)
    }
    static lineSphereIntercetionBool(line = [-0.45, 0, 0.45], lineOrigin = [282.75,0,0], sphereOrigin = [0,0,0], sphereRadius=200) {
        line = math.dotDivide(line, math.norm(line))
        let check = math.dot(line, math.subtract(lineOrigin, sphereOrigin)) ** 2 - (math.norm(math.subtract(lineOrigin, sphereOrigin)) ** 2 - sphereRadius ** 2)
        return check > 0
    } 
    static calculateLaunch(siteEci = [6700, 0, 0], targetEci = [42164, 0, 0, 0, 3.014, 0], launchDate = new Date()) {
        let siteVel = math.cross([0,0,2*Math.PI / 86164], siteEci)
        let tof = Launch.estTofToApogee(siteEci, targetEci)
        tof = Launch.findApogeeRendezvous(siteEci, targetEci, tof)
        if (tof === false) {
            return false
        }
        // tof *= apogeeRatio
        // console.log(tof);
        let targetEndState = propToTime(targetEci, tof, false)
        let vOptions = [solveLambertsProblem(siteEci, targetEndState.slice(0,3), tof, 0, false).v1,solveLambertsProblem(siteEci, targetEndState.slice(0,3), tof, 0, true).v1].filter(s => s !== undefined).filter(s => {
            return s.filter(a => isNaN(a)).length === 0
        })
        if (vOptions.length > 0) {
            let dV = vOptions.map(s => math.norm(math.subtract(s, siteVel)))
            let minIndex = dV.findIndex(s => s === math.min(dV))
            vOptions = vOptions[minIndex]
            // console.log(vOptions);
            let elevationAngle = 90-math.acos(math.dot(siteEci, vOptions) / math.norm(siteEci) / math.norm(vOptions))*180/Math.PI
            
                // Calculate sun angle at rendezvous
            let startState = [...siteEci,...vOptions]
            let endState = propToTime(startState, tof)
            let sunEci = astro.sunEciFromTime(new Date(launchDate - (-tof*1000)))
            let relativeVel = math.subtract(endState.slice(3), targetEndState.slice(3)).map(s => -s)
            let cats = math.acos(math.dot(relativeVel, sunEci) / math.norm(relativeVel) / math.norm(sunEci))*180/Math.PI
            let illuminated = Launch.isSatIlluminated(endState, sunEci)
            return {
                launchState: [...siteEci, ...vOptions],
                elevationAngle,
                tof,
                targetEndState,
                cats,
                illuminated
            }
            // }
    
        }
        return false
    }
}

const EGM_96_NORMALIZED = [
    [2, 0, -0.000484165371736, 0],
    [2, 1, -1.86987635955e-10, 1.19528012031e-9],
    [2, 2, 2.43914352398e-6, -1.40016683654e-6],
    [3, 0, 9.57254173792e-7, 0],
    [3, 1, 2.02998882184e-6, 2.48513158716e-7],
    [3, 2, 9.04627768605e-7, -6.19025944205e-7],
    [3, 3, 7.21072657057e-7, 1.41435626958e-6],
    [4, 0, 5.39873863789e-7, 0],
    [4, 1, -5.36321616971e-7, -4.73440265853e-7],
    [4, 2, 3.50694105785e-7, 6.6267157254e-7],
    [4, 3, 9.90771803829e-7, -2.00928369177e-7],
    [4, 4, -1.88560802735e-7, 3.08853169333e-7],
    [5, 0, 6.8532347563e-8, 0],
    [5, 1, -6.21012128528e-8, -9.44226127525e-8],
    [5, 2, 6.52438297612e-7, -3.23349612668e-7],
    [5, 3, -4.51955406071e-7, -2.14847190624e-7],
    [5, 4, -2.95301647654e-7, 4.96658876769e-8],
    [5, 5, 1.74971983203e-7, -6.69384278219e-7],
    [6, 0, -1.49957994714e-7, 0],
    [6, 1, -7.60879384947e-8, 2.62890545501e-8],
    [6, 2, 4.81732442832e-8, -3.73728201347e-7],
    [6, 3, 5.71730990516e-8, 9.02694517163e-9],
    [6, 4, -8.62142660109e-8, -4.71408154267e-7],
    [6, 5, -2.6713332549e-7, -5.36488432483e-7],
    [6, 6, 9.67616121092e-9, -2.37192006935e-7],
    [7, 0, 9.0978937145e-8, 0],
    [7, 1, 2.79872910488e-7, 9.54336911867e-8],
    [7, 2, 3.29743816488e-7, 9.30667596042e-8],
    [7, 3, 2.50398657706e-7, -2.17198608738e-7],
    [7, 4, -2.75114355257e-7, -1.23800392323e-7],
    [7, 5, 1.93765507243e-9, 1.77377719872e-8],
    [7, 6, -3.58856860645e-7, 1.51789817739e-7],
    [7, 7, 1.09185148045e-9, 2.44415707993e-8],
    [8, 0, 4.96711667324e-8, 0],
    [8, 1, 2.33422047893e-8, 5.90060493411e-8],
    [8, 2, 8.02978722615e-8, 6.54175425859e-8],
    [8, 3, -1.91877757009e-8, -8.63454445021e-8],
    [8, 4, -2.44600105471e-7, 7.00233016934e-8],
    [8, 5, -2.55352403037e-8, 8.91462164788e-8],
    [8, 6, -6.57361610961e-8, 3.09238461807e-7],
    [8, 7, 6.72811580072e-8, 7.47440473633e-8],
    [8, 8, -1.24092493016e-7, 1.20533165603e-7],
    [9, 0, 2.76714300853e-8, 0],
    [9, 1, 1.43387502749e-7, 2.16834947618e-8],
    [9, 2, 2.22288318564e-8, -3.22196647116e-8],
    [9, 3, -1.60811502143e-7, -7.42287409462e-8],
    [9, 4, -9.00179225336e-9, 1.94666779475e-8],
    [9, 5, -1.66165092924e-8, -5.41113191483e-8],
    [9, 6, 6.26941938248e-8, 2.22903525945e-7],
    [9, 7, -1.18366323475e-7, -9.65152667886e-8],
    [9, 8, 1.88436022794e-7, -3.08566220421e-9],
    [9, 9, -4.77475386132e-8, 9.66412847714e-8],
    [10, 0, 5.26222488569e-8, 0],
    [10, 1, 8.35115775652e-8, -1.31314331796e-7],
    [10, 2, -9.42413882081e-8, -5.1579165739e-8],
    [10, 3, -6.89895048176e-9, -1.53768828694e-7],
    [10, 4, -8.40764549716e-8, -7.92806255331e-8],
    [10, 5, -4.93395938185e-8, -5.05370221897e-8],
    [10, 6, -3.75885236598e-8, -7.95667053872e-8],
    [10, 7, 8.11460540925e-9, -3.36629641314e-9],
    [10, 8, 4.04927981694e-8, -9.18705975922e-8],
    [10, 9, 1.25491334939e-7, -3.76516222392e-8],
    [10, 10, 1.00538634409e-7, -2.4014844952e-8],
    [11, 0, -5.09613707522e-8, 0],
    [11, 1, 1.51687209933e-8, -2.68604146166e-8],
    [11, 2, 1.86309749878e-8, -9.90693862047e-8],
    [11, 3, -3.09871239854e-8, -1.4813180426e-7],
    [11, 4, -3.89580205051e-8, -6.3666651198e-8],
    [11, 5, 3.77848029452e-8, 4.94736238169e-8],
    [11, 6, -1.18676592395e-9, 3.44769584593e-8],
    [11, 7, 4.11565188074e-9, -8.98252808977e-8],
    [11, 8, -5.984108413e-9, 2.43989612237e-8],
    [11, 9, -3.14231072723e-8, 4.17731829829e-8],
    [11, 10, -5.21882681927e-8, -1.83364561788e-8],
    [11, 11, 4.60344448746e-8, -6.96662308185e-8],
    [12, 0, 3.77252636558e-8, 0],
    [12, 1, -5.40654977836e-8, -4.35675748979e-8],
    [12, 2, 1.42979642253e-8, 3.20975937619e-8],
    [12, 3, 3.93995876403e-8, 2.44264863505e-8],
    [12, 4, -6.86908127934e-8, 4.15081109011e-9],
    [12, 5, 3.0941112873e-8, 7.82536279033e-9],
    [12, 6, 3.41523275208e-9, 3.91765484449e-8],
    [12, 7, -1.86909958587e-8, 3.56131849382e-8],
    [12, 8, -2.53769398865e-8, 1.69361024629e-8],
    [12, 9, 4.22880630662e-8, 2.52692598301e-8],
    [12, 10, -6.17619654902e-9, 3.08375794212e-8],
    [12, 11, 1.12502994122e-8, -6.37946501558e-9],
    [12, 12, -2.4953260739e-9, -1.117806019e-8],
    [13, 0, 4.22982206413e-8, 0],
    [13, 1, -5.13569699124e-8, 3.90510386685e-8],
    [13, 2, 5.59217667099e-8, -6.27337565381e-8],
    [13, 3, -2.19360927945e-8, 9.74829362237e-8],
    [13, 4, -3.13762599666e-9, -1.19627874492e-8],
    [13, 5, 5.90049394905e-8, 6.64975958036e-8],
    [13, 6, -3.59038073075e-8, -6.57280613686e-9],
    [13, 7, 2.53002147087e-9, -6.21470822331e-9],
    [13, 8, -9.83150822695e-9, -1.04740222825e-8],
    [13, 9, 2.47325771791e-8, 4.52870369936e-8],
    [13, 10, 4.1032465393e-8, -3.6812102948e-8],
    [13, 11, -4.43869677399e-8, -4.76507804288e-9],
    [13, 12, -3.12622200222e-8, 8.78405809267e-8],
    [13, 13, -6.12759553199e-8, 6.85261488594e-8],
    [14, 0, -2.42786502921e-8, 0],
    [14, 1, -1.86968616381e-8, 2.94747542249e-8],
    [14, 2, -3.67789379502e-8, -5.16779392055e-9],
    [14, 3, 3.58875097333e-8, 2.04618827833e-8],
    [14, 4, 1.83865617792e-9, -2.26780613566e-8],
    [14, 5, 2.87344273542e-8, -1.63882249728e-8],
    [14, 6, -1.94810485574e-8, 2.47831272781e-9],
    [14, 7, 3.75003839415e-8, -4.17291319429e-9],
    [14, 8, -3.50946485865e-8, -1.53515265203e-8],
    [14, 9, 3.20284939341e-8, 2.88804922064e-8],
    [14, 10, 3.90329180008e-8, -1.44308452469e-9],
    [14, 11, 1.53970516502e-8, -3.90548173245e-8],
    [14, 12, 8.40829163869e-9, -3.11327189117e-8],
    [14, 13, 3.22147043964e-8, 4.5189722496e-8],
    [14, 14, -5.18980794309e-8, -4.81506636748e-9],
    [15, 0, 1.47910068708e-9, 0],
    [15, 1, 1.00817268177e-8, 1.09773066324e-8],
    [15, 2, -2.13942673775e-8, -3.08914875777e-8],
    [15, 3, 5.21392929041e-8, 1.72892926103e-8],
    [15, 4, -4.08150084078e-8, 6.50174707794e-9],
    [15, 5, 1.24935723108e-8, 8.08375563996e-9],
    [15, 6, 3.31211643896e-8, -3.68246004304e-8],
    [15, 7, 5.96210699259e-8, 5.31841171879e-9],
    [15, 8, -3.22428691498e-8, 2.21523579587e-8],
    [15, 9, 1.28788268085e-8, 3.75629820829e-8],
    [15, 10, 1.04688722521e-8, 1.47222147015e-8],
    [15, 11, -1.11675061934e-9, 1.80996198432e-8],
    [15, 12, -3.23962134415e-8, 1.55243104746e-8],
    [15, 13, -2.83933019117e-8, -4.22066791103e-9],
    [15, 14, 5.1916885933e-9, -2.43752739666e-8],
    [15, 15, -1.90930538322e-8, -4.71139421558e-9],
    [16, 0, -3.15322986722e-9, 0],
    [16, 1, 2.58360856231e-8, 3.25447560859e-8],
    [16, 2, -2.33671404512e-8, 2.88799363439e-8],
    [16, 3, -3.36019429391e-8, -2.2041898801e-8],
    [16, 4, 4.02316284314e-8, 4.83837716909e-8],
    [16, 5, -1.29501939245e-8, -3.19458578129e-9],
    [16, 6, 1.40239252323e-8, -3.50760208303e-8],
    [16, 7, -7.08412635136e-9, -8.81581561131e-9],
    [16, 8, -2.09018868094e-8, 5.0052739053e-9],
    [16, 9, -2.18588720643e-8, -3.95012419994e-8],
    [16, 10, -1.17529900814e-8, 1.14211582961e-8],
    [16, 11, 1.87574042592e-8, -3.03161919925e-9],
    [16, 12, 1.95400194038e-8, 6.66983574071e-9],
    [16, 13, 1.38196369576e-8, 1.02778499508e-9],
    [16, 14, -1.93182168856e-8, -3.86174893776e-8],
    [16, 15, -1.45149060142e-8, -3.27443078739e-8],
    [16, 16, -3.79671710746e-8, 3.02155372655e-9],
    [17, 0, 1.97605066395e-8, 0],
    [17, 1, -2.54177575118e-8, -3.06630529689e-8],
    [17, 2, -1.95988656721e-8, 6.4926589341e-9],
    [17, 3, 5.64123066224e-9, 6.78327095529e-9],
    [17, 4, 7.07457075637e-9, 2.49437600834e-8],
    [17, 5, -1.54987006052e-8, 6.60021551851e-9],
    [17, 6, -1.18194012847e-8, -2.89770975177e-8],
    [17, 7, 2.42149702381e-8, -4.22222973697e-9],
    [17, 8, 3.88442097559e-8, 3.58904095943e-9],
    [17, 9, 3.81356493231e-9, -2.81466943714e-8],
    [17, 10, -3.88216085542e-9, 1.81328176508e-8],
    [17, 11, -1.57356600363e-8, 1.06560649404e-8],
    [17, 12, 2.88013010655e-8, 2.03450136084e-8],
    [17, 13, 1.65503425731e-8, 2.04667531435e-8],
    [17, 14, -1.41983872649e-8, 1.14948025244e-8],
    [17, 15, 5.42100361657e-9, 5.32610369811e-9],
    [17, 16, -3.01992205043e-8, 3.65331918531e-9],
    [17, 17, -3.43086856041e-8, -1.98523455381e-8],
    [18, 0, 5.08691038332e-9, 0],
    [18, 1, 7.21098449649e-9, -3.88714473013e-8],
    [18, 2, 1.40631771205e-8, 1.00093396253e-8],
    [18, 3, -5.07232520873e-9, -4.90865931335e-9],
    [18, 4, 5.48759308217e-8, -1.3526711772e-9],
    [18, 5, 5.48710485555e-9, 2.64338629459e-8],
    [18, 6, 1.46570755271e-8, -1.36438019951e-8],
    [18, 7, 6.75812328417e-9, 6.88577494235e-9],
    [18, 8, 3.07619845144e-8, 4.17827734107e-9],
    [18, 9, -1.8847060188e-8, 3.68302736953e-8],
    [18, 10, 5.27535358934e-9, -4.66091535881e-9],
    [18, 11, -7.2962851896e-9, 1.9521520802e-9],
    [18, 12, -2.97449412422e-8, -1.64497878395e-8],
    [18, 13, -6.27919717152e-9, -3.48383939938e-8],
    [18, 14, -8.1560533641e-9, -1.28636585027e-8],
    [18, 15, -4.05003412879e-8, -2.02684998021e-8],
    [18, 16, 1.04141042028e-8, 6.61468817624e-9],
    [18, 17, 3.58771586841e-9, 4.48065587564e-9],
    [18, 18, 3.12351953717e-9, -1.09906032543e-8],
    [19, 0, -3.25780965394e-9, 0],
    [19, 1, -7.59903885319e-9, 1.26835472605e-9],
    [19, 2, 3.53541528655e-8, -1.31346303514e-9],
    [19, 3, -9.74103607309e-9, 1.50662259043e-9],
    [19, 4, 1.57039009057e-8, -7.61677383811e-9],
    [19, 5, 1.09629213379e-8, 2.83172176438e-8],
    [19, 6, -4.08745178658e-9, 1.86219430719e-8],
    [19, 7, 4.78275337044e-9, -7.172834559e-9],
    [19, 8, 2.9490836428e-8, -9.93037002883e-9],
    [19, 9, 3.07961427159e-9, 6.94110477214e-9],
    [19, 10, -3.38415069043e-8, -7.37981767136e-9],
    [19, 11, 1.60443652916e-8, 9.96673453483e-9],
    [19, 12, -2.47106581581e-9, 9.16852310642e-9],
    [19, 13, -7.4471737998e-9, -2.82584466742e-8],
    [19, 14, -4.70502589215e-9, -1.29526697983e-8],
    [19, 15, -1.76580549771e-8, -1.40350990039e-8],
    [19, 16, -2.16950096188e-8, -7.24534721567e-9],
    [19, 17, 2.90444936079e-8, -1.5345653107e-8],
    [19, 18, 3.48382199593e-8, -9.54146344917e-9],
    [19, 19, -2.5734934943e-9, 4.83151822363e-9],
    [20, 0, 2.22384610651e-8, 0],
    [20, 1, 5.16303125218e-9, 6.69626726966e-9],
    [20, 2, 1.98831128238e-8, 1.75183843257e-8],
    [20, 3, -3.62601436785e-9, 3.79590724141e-8],
    [20, 4, 2.42238118652e-9, -2.11057611874e-8],
    [20, 5, -1.07042562564e-8, -7.71860083169e-9],
    [20, 6, 1.1047483757e-8, -2.17720365898e-9],
    [20, 7, -2.10090282728e-8, -2.23491503969e-11],
    [20, 8, 4.42419185637e-9, 1.83035804593e-9],
    [20, 9, 1.78846216942e-8, -6.63940865358e-9],
    [20, 10, -3.25394919988e-8, -5.12308873621e-9],
    [20, 11, 1.38992707697e-8, -1.87706454942e-8],
    [20, 12, -6.3575060075e-9, 1.80260853103e-8],
    [20, 13, 2.75222725997e-8, 6.90887077588e-9],
    [20, 14, 1.15841169405e-8, -1.43176160143e-8],
    [20, 15, -2.60130744291e-8, -7.84379672413e-10],
    [20, 16, -1.24137147118e-8, -2.77500443628e-10],
    [20, 17, 4.3690966796e-9, -1.37420446198e-8],
    [20, 18, 1.51842883022e-8, -8.08429903142e-10],
    [20, 19, -3.14942002852e-9, 1.06505202245e-8],
    [20, 20, 4.01448327968e-9, -1.20450644785e-8],
    [21, 0, 5.87820252575e-9, 0],
    [21, 1, -1.61000670141e-8, 2.84359400791e-8],
    [21, 2, -6.54460482558e-9, 3.78474868508e-9],
    [21, 3, 1.9549199526e-8, 2.26286963716e-8],
    [21, 4, -5.76604339239e-9, 1.94493782631e-8],
    [21, 5, 2.58856303016e-9, 1.70850368669e-9],
    [21, 6, -1.40168810589e-8, -2.73814826381e-12],
    [21, 7, -8.64357168475e-9, 4.42612277119e-9],
    [21, 8, -1.70477278237e-8, 1.5071119263e-9],
    [21, 9, 1.64489062394e-8, 8.30113196365e-9],
    [21, 10, -1.09928976409e-8, -1.46913794684e-9],
    [21, 11, 6.99300364214e-9, -3.53590565124e-8],
    [21, 12, -3.19300109594e-9, 1.45786917947e-8],
    [21, 13, -1.8985452459e-8, 1.40514791436e-8],
    [21, 14, 2.03580785674e-8, 7.5577246284e-9],
    [21, 15, 1.75530220278e-8, 1.04533886832e-8],
    [21, 16, 7.86969109367e-9, -6.56089715279e-9],
    [21, 17, -6.99484489981e-9, -7.36064901147e-9],
    [21, 18, 2.59643291521e-8, -1.1156080613e-8],
    [21, 19, -2.7374163641e-8, 1.63958190052e-8],
    [21, 20, -2.68682473584e-8, 1.62086057168e-8],
    [21, 21, 8.30374873932e-9, -3.75546121742e-9],
    [22, 0, -1.13735124259e-8, 0],
    [22, 1, 1.62309865679e-8, -3.77303475153e-9],
    [22, 2, -2.64090261387e-8, -2.10832402428e-9],
    [22, 3, 1.1658001654e-8, 1.06764617222e-8],
    [22, 4, -2.70979141451e-9, 1.74980820565e-8],
    [22, 5, -1.8645262501e-9, 7.44718166476e-10],
    [22, 6, 9.64390704406e-9, -6.37316743908e-9],
    [22, 7, 1.59715981795e-8, 4.39600942993e-9],
    [22, 8, -2.35157426998e-8, 4.83673695086e-9],
    [22, 9, 8.29435796737e-9, 8.73382159986e-9],
    [22, 10, 6.00704037701e-9, 2.21854121109e-8],
    [22, 11, -4.96078301539e-9, -1.78822672474e-8],
    [22, 12, 2.13502315463e-9, -7.96120522503e-9],
    [22, 13, -1.72631843979e-8, 1.97026896892e-8],
    [22, 14, 1.09297133018e-8, 8.25280905301e-9],
    [22, 15, 2.58410840629e-8, 4.60172998318e-9],
    [22, 16, 1.41258558921e-10, -7.182380053e-9],
    [22, 17, 8.89294096846e-9, -1.45618348246e-8],
    [22, 18, 1.05047447464e-8, -1.64271275481e-8],
    [22, 19, 1.41305509124e-8, -3.84537168599e-9],
    [22, 20, -1.67617655441e-8, 1.99561513321e-8],
    [22, 21, -2.50948756455e-8, 2.36151346133e-8],
    [22, 22, -9.59596694809e-9, 2.49861413883e-9],
    [23, 0, -2.26201075082e-8, 0],
    [23, 1, 1.10870239758e-8, 1.6137915153e-8],
    [23, 2, -1.35191027779e-8, -5.01411714852e-9],
    [23, 3, -2.45128011445e-8, -1.60570438998e-8],
    [23, 4, -2.39887874558e-8, 7.31536362289e-9],
    [23, 5, 7.99636624146e-10, -1.6144974141e-10],
    [23, 6, -1.26082781309e-8, 1.61308155632e-8],
    [23, 7, -8.04132133762e-9, -1.11647197494e-9],
    [23, 8, 7.53785326469e-9, -3.2967992522e-10],
    [23, 9, 2.5505325495e-9, -1.28071525548e-8],
    [23, 10, 1.65167929134e-8, -1.85239620853e-9],
    [23, 11, 9.42656822725e-9, 1.52386181583e-8],
    [23, 12, 1.63632625535e-8, -1.24098327824e-8],
    [23, 13, -1.15107832808e-8, -4.84279171627e-9],
    [23, 14, 6.75321602206e-9, -1.82899962212e-9],
    [23, 15, 1.8689804286e-8, -3.60523754481e-9],
    [23, 16, 6.13840121864e-9, 1.10362707266e-8],
    [23, 17, -5.5372102391e-9, -1.2845906046e-8],
    [23, 18, 8.43361263813e-9, -1.49115921605e-8],
    [23, 19, -5.20848228342e-9, 1.07789593943e-8],
    [23, 20, 8.60434396837e-9, -5.34641639372e-9],
    [23, 21, 1.54578189867e-8, 1.15333325358e-8],
    [23, 22, -1.78417206471e-8, 4.33092348903e-9],
    [23, 23, 2.85393980111e-9, -1.1323294597e-8],
    [24, 0, 7.63657386411e-10, 0],
    [24, 1, -3.14943681427e-9, -1.77191190396e-9],
    [24, 2, 1.38595572093e-9, 1.711040664e-8],
    [24, 3, -4.76406913528e-9, -9.42329378125e-9],
    [24, 4, 6.05108036341e-9, 5.49769910191e-9],
    [24, 5, -7.2947904748e-9, -2.13826490504e-8],
    [24, 6, 4.54210367535e-9, 1.85596665318e-9],
    [24, 7, -6.14244489298e-9, 4.70081667951e-9],
    [24, 8, 1.54822444425e-8, -4.34472097787e-9],
    [24, 9, -9.76623425797e-9, -1.6275513762e-8],
    [24, 10, 1.08934628974e-8, 2.09168783608e-8],
    [24, 11, 1.45280775337e-8, 1.87398018797e-8],
    [24, 12, 1.18970310717e-8, -6.2293309815e-9],
    [24, 13, -2.89676673058e-9, 3.13251295024e-9],
    [24, 14, -2.00006558603e-8, -1.87249636821e-9],
    [24, 15, 6.10396350698e-9, -1.58957680563e-8],
    [24, 16, 8.88750753375e-9, 2.96492703352e-9],
    [24, 17, -1.19629964611e-8, -5.82074593955e-9],
    [24, 18, -6.52630641555e-10, -1.01332355837e-8],
    [24, 19, -4.38896550264e-9, -8.14552569977e-9],
    [24, 20, -5.17551981851e-9, 8.90354942378e-9],
    [24, 21, 6.03436755046e-9, 1.40116090741e-8],
    [24, 22, 3.93640283055e-9, -4.28327655754e-9],
    [24, 23, -6.1428347955e-9, -8.692679021e-9],
    [24, 24, 1.23903921309e-8, -3.75059286959e-9],
    [25, 0, 3.21309208115e-9, 0],
    [25, 1, 6.89649208567e-9, -7.995518294e-9],
    [25, 2, 2.19498139173e-8, 9.01370249111e-9],
    [25, 3, -1.17774931587e-8, -1.26719024392e-8],
    [25, 4, 9.4254362892e-9, 6.84937199311e-10],
    [25, 5, -1.00497487339e-8, -9.2212239967e-10],
    [25, 6, 1.66832871654e-8, 4.30583576199e-10],
    [25, 7, 7.71426681671e-9, -4.11703290425e-9],
    [25, 8, 3.1565194415e-9, -7.81960217669e-10],
    [25, 9, -2.99385350515e-8, 2.12695473199e-8],
    [25, 10, 8.81931818034e-9, -4.18041586166e-9],
    [25, 11, 1.2340148568e-9, 1.08069128123e-8],
    [25, 12, -7.65146786755e-9, 1.1747374286e-8],
    [25, 13, 8.32308127158e-9, -1.13072604626e-8],
    [25, 14, -1.97042124794e-8, 6.53183488635e-9],
    [25, 15, -4.35732052985e-9, -7.35147227573e-9],
    [25, 16, 9.18239548455e-10, -1.28124888592e-8],
    [25, 17, -1.52176535379e-8, -3.21280397924e-9],
    [25, 18, 1.21901534245e-9, -1.49040483259e-8],
    [25, 19, 7.77589111757e-9, 9.92518771941e-9],
    [25, 20, -7.50856670672e-9, -5.62826155305e-10],
    [25, 21, 1.0723284068e-8, 8.16090174381e-9],
    [25, 22, -1.39902235929e-8, 3.58546198324e-9],
    [25, 23, 8.40270853655e-9, -1.23338407961e-8],
    [25, 24, 4.12447134569e-9, -8.30716465317e-9],
    [25, 25, 1.07484366767e-8, 4.72369913984e-9],
    [26, 0, 5.05833635414e-9, 0],
    [26, 1, -1.54756177965e-9, -7.70012788871e-9],
    [26, 2, -3.58729876836e-9, 1.14484111182e-8],
    [26, 3, 1.40505671267e-8, 4.30905534294e-9],
    [26, 4, 1.90548709216e-8, -1.94161179658e-8],
    [26, 5, 1.07190025408e-8, 9.08952851813e-9],
    [26, 6, 1.13116909406e-8, -9.34393384449e-9],
    [26, 7, -1.562282956e-9, 4.81168302477e-9],
    [26, 8, 3.94920146317e-9, 1.153405253e-9],
    [26, 9, -1.20371433638e-8, 4.75177058134e-10],
    [26, 10, -1.41246124334e-8, -6.45217247294e-9],
    [26, 11, -5.20385857649e-9, 2.12443340407e-9],
    [26, 12, -1.75071176484e-8, 2.01974971938e-9],
    [26, 13, -3.35708835245e-11, 1.50474091686e-9],
    [26, 14, 7.96385051492e-9, 7.84704068835e-9],
    [26, 15, -1.32388781089e-8, 8.03960091442e-9],
    [26, 16, 1.29093226253e-9, -6.11434455706e-9],
    [26, 17, -1.24494157564e-8, 7.8077484564e-9],
    [26, 18, -1.30317424459e-8, 4.9998916257e-9],
    [26, 19, -2.05807464595e-9, 3.54396135438e-9],
    [26, 20, 6.55952144018e-9, -1.1687804118e-8],
    [26, 21, -8.70038868454e-9, 1.68222257564e-9],
    [26, 22, 1.01580452049e-8, 7.54358531576e-9],
    [26, 23, 1.24105057436e-9, 1.08580088935e-8],
    [26, 24, 8.58620351967e-9, 1.48288510099e-8],
    [26, 25, 3.93441578873e-9, -5.97792415806e-10],
    [26, 26, 3.93179749568e-10, 1.93894997772e-9],
    [27, 0, 2.7717632236e-9, 0],
    [27, 1, 2.48982909452e-9, 3.77378455357e-9],
    [27, 2, 1.45270146453e-9, 5.03113268026e-10],
    [27, 3, -3.62306812856e-10, 1.088457625e-8],
    [27, 4, -5.99191537157e-10, 9.40517681233e-9],
    [27, 5, 1.67690560888e-8, 1.38338587209e-8],
    [27, 6, 3.64265989803e-9, 6.13032807744e-9],
    [27, 7, -1.23459266009e-8, -3.86514075952e-9],
    [27, 8, -6.1040764482e-9, -8.99504471581e-9],
    [27, 9, 3.40113157078e-9, 1.10992938665e-8],
    [27, 10, -1.33158893187e-8, 1.72832279915e-10],
    [27, 11, 1.98322808107e-9, -9.69054254426e-9],
    [27, 12, -1.13695413044e-8, 1.90072943781e-9],
    [27, 13, -4.97224781272e-9, -4.14521559996e-9],
    [27, 14, 1.55033957088e-8, 1.1882128969e-8],
    [27, 15, -1.80057326196e-9, 1.1763698622e-9],
    [27, 16, 2.7572995289e-9, 2.78770269194e-9],
    [27, 17, 3.79281571763e-9, 3.14983101049e-10],
    [27, 18, -2.87144071715e-9, 7.44190558718e-9],
    [27, 19, -3.26518614707e-10, -2.93243500455e-9],
    [27, 20, -8.55182561846e-10, 3.47617208115e-9],
    [27, 21, 4.86877030983e-9, -7.0872528354e-9],
    [27, 22, -5.74332100084e-9, 2.90056687384e-9],
    [27, 23, -5.41033470941e-9, -1.10452433655e-8],
    [27, 24, 4.16951885933e-10, -1.80038186307e-9],
    [27, 25, 1.22815470212e-8, 5.62425137285e-9],
    [27, 26, -6.59498075164e-9, -2.22838418639e-9],
    [27, 27, 7.60067381059e-9, 6.9238741892e-10],
    [28, 0, -9.10376375863e-9, 0],
    [28, 1, -5.55484993587e-9, 7.9330019258e-9],
    [28, 2, -1.5189131211e-8, -7.97957089012e-9],
    [28, 3, 2.5318254224e-9, 1.11373049392e-8],
    [28, 4, -1.99212752126e-9, 1.25054704704e-8],
    [28, 5, 1.08871875702e-8, -4.22573826989e-9],
    [28, 6, -5.22194316032e-9, 1.32656509709e-8],
    [28, 7, -7.05588863746e-10, 5.12740997711e-9],
    [28, 8, -4.23704976329e-9, -3.32584474553e-9],
    [28, 9, 1.13842461859e-8, -1.04163010811e-8],
    [28, 10, -9.22867885082e-9, 8.17851851593e-9],
    [28, 11, -2.9809734257e-9, -1.45944538949e-9],
    [28, 12, -4.83471863256e-10, 9.64951845027e-9],
    [28, 13, 1.64993974957e-9, 6.63803768689e-9],
    [28, 14, -8.23334828619e-9, -1.26939492243e-8],
    [28, 15, -1.22774798187e-8, -1.97537366262e-9],
    [28, 16, -3.57280690709e-9, -1.35890044766e-8],
    [28, 17, 1.33742628184e-8, -4.72374226319e-9],
    [28, 18, 5.62532322748e-9, -3.87230727328e-9],
    [28, 19, 5.77104709635e-9, 2.35011734292e-8],
    [28, 20, -1.15922189521e-9, 6.62939940662e-9],
    [28, 21, 6.63154344375e-9, 6.33201211223e-9],
    [28, 22, -1.94231451662e-9, -7.33725263107e-9],
    [28, 23, 6.20158165102e-9, 2.61202437682e-9],
    [28, 24, 1.11186270621e-8, -1.35606378769e-8],
    [28, 25, 7.29495896149e-9, -1.76041477031e-8],
    [28, 26, 1.23084992259e-8, 3.89251843939e-9],
    [28, 27, -8.11971206724e-9, 1.3027922855e-9],
    [28, 28, 6.9872587832e-9, 6.80526167979e-9],
    [29, 0, -4.97406439473e-9, 0],
    [29, 1, 4.98979084585e-9, -9.82512461189e-9],
    [29, 2, -3.12119754621e-9, -2.63433487676e-9],
    [29, 3, 1.82518120454e-9, -1.05769977751e-8],
    [29, 4, -2.42786314995e-8, 2.26110758622e-9],
    [29, 5, -6.8110306367e-9, 6.01242555817e-9],
    [29, 6, 1.19592879211e-8, 9.7020069574e-9],
    [29, 7, -5.91100934209e-9, -2.14599788734e-9],
    [29, 8, -1.6946723555e-8, 1.11160276839e-8],
    [29, 9, -1.2937116169e-9, 1.41793573226e-9],
    [29, 10, 1.37184624798e-8, 1.79543486167e-9],
    [29, 11, -5.96272885876e-9, 6.33350180946e-9],
    [29, 12, -4.56278910357e-10, -5.01222008898e-9],
    [29, 13, -1.09095923049e-9, -2.34179014389e-9],
    [29, 14, -3.23718965114e-9, -4.58306325034e-9],
    [29, 15, -9.57359749406e-9, -6.77546725808e-9],
    [29, 16, 1.37450063496e-9, -1.4864526654e-8],
    [29, 17, -1.57662415501e-9, -3.92506699434e-9],
    [29, 18, -3.67597840865e-9, -2.58549575294e-9],
    [29, 19, -6.30046143533e-9, 5.86840708296e-9],
    [29, 20, -7.96446331531e-9, 5.74239983127e-9],
    [29, 21, -9.8726430286e-9, -5.51700601596e-9],
    [29, 22, 1.15574836058e-8, -1.47663300854e-9],
    [29, 23, -1.84576717899e-9, 2.63546763516e-9],
    [29, 24, 3.42199668119e-10, -2.38230581193e-9],
    [29, 25, 5.85864038329e-9, 8.68333958543e-9],
    [29, 26, 7.87039835357e-9, -6.92232980921e-9],
    [29, 27, -7.98313300841e-9, -1.01903214091e-9],
    [29, 28, 9.73355537526e-9, -5.71293958601e-9],
    [29, 29, 1.28224843767e-8, -5.01548480482e-9],
    [30, 0, 6.02882084759e-9, 0],
    [30, 1, -5.57556615596e-10, 1.24285275602e-9],
    [30, 2, -1.0370644769e-8, -2.61802322444e-9],
    [30, 3, 2.14692300603e-9, -1.36464188501e-8],
    [30, 4, -4.55090433473e-10, -3.91117213505e-9],
    [30, 5, -4.36973977446e-9, -5.35558974983e-9],
    [30, 6, 3.28451285815e-10, 3.17808233981e-9],
    [30, 7, 4.04923220309e-9, 1.83962458779e-9],
    [30, 8, 2.54952865236e-9, 4.62058281854e-9],
    [30, 9, -7.32592511128e-9, -9.7277817424e-9],
    [30, 10, 4.27609484555e-9, -4.10864961814e-9],
    [30, 11, -1.04043005227e-8, 1.07581457651e-8],
    [30, 12, 1.71622295302e-8, -1.08456775556e-8],
    [30, 13, 1.42173587056e-8, 2.96806226352e-9],
    [30, 14, 5.11505860834e-9, 8.07288811257e-9],
    [30, 15, 2.10512146846e-10, -1.04541123836e-9],
    [30, 16, -1.08921920457e-8, 4.35254063533e-9],
    [30, 17, -6.14382436271e-9, -6.03140938575e-9],
    [30, 18, -1.1114926509e-8, -7.65521957976e-9],
    [30, 19, -1.2967398433e-8, 2.42005669694e-9],
    [30, 20, -4.89261172033e-9, 1.27655684422e-8],
    [30, 21, -1.0628473781e-8, -5.97537587412e-9],
    [30, 22, -4.83763240001e-9, -9.37720111156e-9],
    [30, 23, 5.7411388543e-9, -1.03756082222e-8],
    [30, 24, -2.35238020789e-9, -2.7590933962e-9],
    [30, 25, 3.04426404856e-9, -1.54853389229e-8],
    [30, 26, 1.22149787623e-9, 1.24069551653e-8],
    [30, 27, -7.95063844863e-9, 1.27529431593e-8],
    [30, 28, -5.47120800289e-9, -7.96006293513e-9],
    [30, 29, 4.1592295424e-9, 1.89489104417e-9],
    [30, 30, 2.64794018006e-9, 8.12994755178e-9],
    [31, 0, 7.33100089318e-9, 0],
    [31, 1, 6.11169376734e-9, -1.60774540844e-8],
    [31, 2, 7.49625106123e-9, 6.37776322444e-9],
    [31, 3, -8.89920966189e-9, -7.6550294416e-9],
    [31, 4, 1.22555580723e-8, -4.94466436575e-9],
    [31, 5, -8.71279064045e-9, 3.08325747379e-9],
    [31, 6, -1.68890803585e-9, 1.3703621527e-9],
    [31, 7, -2.71996133536e-9, -6.8862512168e-10],
    [31, 8, -7.50260355354e-10, 2.28102724239e-9],
    [31, 9, -6.55840403272e-10, 5.24179002617e-9],
    [31, 10, 3.99161675027e-9, -4.73500202132e-9],
    [31, 11, 6.93506892777e-10, 2.08668068881e-8],
    [31, 12, 5.5287540984e-10, 4.52042167068e-9],
    [31, 13, 9.40389423562e-9, 4.6684078573e-9],
    [31, 14, -7.88650771167e-9, 3.51952460147e-9],
    [31, 15, 4.29954776132e-9, -2.80870684394e-9],
    [31, 16, -7.19430261173e-9, 6.11805049979e-9],
    [31, 17, -2.53821168958e-9, 6.83008216722e-9],
    [31, 18, -6.02099321996e-10, -2.04187286905e-9],
    [31, 19, 2.89086482301e-9, 4.43976791609e-9],
    [31, 20, -1.75732193914e-9, 5.64081954558e-9],
    [31, 21, -9.67143669208e-9, 7.09357408027e-9],
    [31, 22, -9.0531201252e-9, -1.18308417466e-8],
    [31, 23, 8.32234353898e-9, 4.51774572555e-9],
    [31, 24, -2.81565064366e-9, -3.34369513768e-9],
    [31, 25, -1.64574268169e-8, -2.20460908971e-9],
    [31, 26, -1.26653070356e-8, 1.59189398991e-9],
    [31, 27, -1.34953305827e-9, 1.07507650019e-8],
    [31, 28, 1.04226918411e-8, 2.8072229491e-9],
    [31, 29, -1.5812688103e-9, -2.18247510672e-9],
    [31, 30, -9.47416722001e-10, -7.78077525656e-9],
    [31, 31, -8.59193452715e-9, -1.85200316483e-9],
    [32, 0, -2.33966288032e-9, 0],
    [32, 1, -1.69210486076e-9, 1.27760467976e-9],
    [32, 2, 1.13999662663e-8, -3.35609127916e-9],
    [32, 3, -1.444433154e-10, 4.05424830941e-9],
    [32, 4, 8.56367829112e-10, -6.75422476107e-9],
    [32, 5, 8.60776205333e-9, 1.82572279646e-9],
    [32, 6, -1.00402568672e-8, -7.6305617634e-9],
    [32, 7, 1.37058613278e-9, 2.75465347035e-9],
    [32, 8, 1.19653531908e-8, 4.91018212548e-9],
    [32, 9, 7.332252213e-9, 7.18971591052e-10],
    [32, 10, 9.12133506379e-11, -5.70680927495e-9],
    [32, 11, -5.42043742127e-9, 7.583606425e-9],
    [32, 12, -1.70289059214e-8, 1.40808168623e-8],
    [32, 13, 4.02186822027e-9, 5.34936491964e-9],
    [32, 14, -5.44420334437e-9, 2.20410694316e-9],
    [32, 15, 5.1658020828e-9, -8.74727531741e-9],
    [32, 16, 4.14867061294e-9, 4.27270420004e-9],
    [32, 17, -6.46857778906e-9, 1.01916486215e-8],
    [32, 18, 1.27286345117e-8, -1.12136888089e-9],
    [32, 19, 7.55189536923e-10, -2.7754653073e-9],
    [32, 20, 3.8161056442e-9, 3.19534855653e-10],
    [32, 21, -2.33262996771e-9, 1.16411650251e-8],
    [32, 22, -1.20880678762e-8, -2.72691793232e-9],
    [32, 23, 8.18682122143e-9, -2.33549712722e-9],
    [32, 24, -3.55036315667e-9, 6.54834763861e-10],
    [32, 25, -1.89374992503e-8, -6.43429532848e-9],
    [32, 26, 5.22535531492e-9, -3.68856221241e-9],
    [32, 27, -4.53740085214e-9, -6.68075560111e-9],
    [32, 28, 1.653041745e-9, -5.73130340772e-9],
    [32, 29, 4.32768192965e-9, 2.88179889934e-9],
    [32, 30, -6.74805866294e-9, 1.39346268546e-9],
    [32, 31, -6.26740251766e-9, -2.18475608171e-10],
    [32, 32, 3.3975660331e-9, 1.42646165155e-9],
    [33, 0, -3.49357179498e-9, 0],
    [33, 1, -1.39642913445e-9, -2.16391760811e-9],
    [33, 2, -7.48774194896e-9, -5.0187208152e-10],
    [33, 3, -1.99661955793e-9, 7.0930410268e-9],
    [33, 4, -4.270199819e-9, 2.27426656698e-9],
    [33, 5, 2.37784729729e-10, 3.74439169451e-9],
    [33, 6, 1.22603039921e-9, -2.87328300836e-9],
    [33, 7, -6.11215086076e-9, 2.49383366316e-9],
    [33, 8, -8.23144405057e-10, 1.44915555407e-8],
    [33, 9, 5.05097392033e-9, 7.4051746902e-9],
    [33, 10, -2.39709923317e-9, 1.07022906758e-9],
    [33, 11, 2.43388836443e-9, -8.67071813487e-9],
    [33, 12, -2.33510532329e-9, 8.9435069891e-9],
    [33, 13, 2.6041538193e-9, 3.13805750981e-9],
    [33, 14, 4.92959662302e-9, 5.71204550617e-9],
    [33, 15, -4.64145303396e-9, -3.47835302325e-9],
    [33, 16, 7.39530517571e-9, 6.28613189283e-9],
    [33, 17, -5.73064590551e-9, 1.28779114927e-8],
    [33, 18, -9.74285933562e-9, -1.89598124592e-9],
    [33, 19, 8.52447331156e-9, 2.07561717246e-9],
    [33, 20, -3.32627500309e-9, -7.77689999053e-9],
    [33, 21, 9.38761672387e-10, 8.17787598674e-10],
    [33, 22, -1.05439940875e-8, -1.56190227392e-8],
    [33, 23, 1.15896250314e-10, -1.01356350767e-8],
    [33, 24, 1.11416074527e-8, -8.57153776484e-9],
    [33, 25, 5.24730532375e-9, -1.04941656537e-8],
    [33, 26, 1.09590005596e-8, 4.5404144025e-9],
    [33, 27, -1.32772908147e-9, 1.26154161942e-9],
    [33, 28, 1.75943381421e-9, -1.02060346415e-9],
    [33, 29, -1.63075128633e-8, 5.72191328891e-9],
    [33, 30, -1.56977064277e-9, -1.84579402264e-8],
    [33, 31, 4.69481868853e-9, 1.02290050028e-9],
    [33, 32, 6.56775919022e-9, -4.39711913398e-9],
    [33, 33, -1.52043850303e-9, 8.31263004529e-9],
    [34, 0, -9.08833340447e-9, 0],
    [34, 1, -2.76889795047e-9, 6.3891897021e-9],
    [34, 2, 6.7688190654e-9, 5.30082118696e-9],
    [34, 3, 1.25429669786e-8, 8.11619669834e-9],
    [34, 4, -8.30005417504e-9, 1.19586870272e-9],
    [34, 5, -3.88131685638e-9, 3.54963449977e-9],
    [34, 6, 4.84093709579e-10, 7.62975480293e-9],
    [34, 7, 2.75125793239e-9, -6.56263573163e-9],
    [34, 8, -9.83446807592e-9, 4.68751478021e-9],
    [34, 9, 1.53042494664e-9, 2.10165697829e-9],
    [34, 10, -7.52633242389e-9, 1.46544229781e-9],
    [34, 11, -3.82043431506e-9, -1.07829735599e-9],
    [34, 12, 1.42629362262e-8, -4.60063642968e-9],
    [34, 13, -3.56240984255e-9, 1.03329523096e-9],
    [34, 14, -2.50187664392e-9, 9.64686908241e-9],
    [34, 15, 3.75939804157e-10, 6.2628624977e-9],
    [34, 16, -1.45874042713e-9, -1.4938092908e-9],
    [34, 17, -4.73747570512e-9, 3.93698829389e-9],
    [34, 18, -1.47488701345e-8, -5.38197998817e-9],
    [34, 19, -3.59837568897e-9, 7.15302015583e-9],
    [34, 20, 3.64466859655e-9, -1.01824147346e-8],
    [34, 21, -9.81980297066e-10, -7.42166456548e-9],
    [34, 22, -3.18152215406e-9, 3.36620175035e-9],
    [34, 23, -1.1297312057e-9, -1.18981902172e-8],
    [34, 24, 8.78079044954e-9, 4.20436158037e-9],
    [34, 25, 8.41097170248e-9, -9.86300815266e-9],
    [34, 26, 3.99964384231e-9, -1.29360014691e-8],
    [34, 27, 1.31566196208e-8, -3.91137836409e-9],
    [34, 28, -1.65320604713e-10, -2.00370653858e-8],
    [34, 29, 7.08151676681e-9, -4.31563574113e-9],
    [34, 30, -2.05666035677e-8, -5.86948946952e-10],
    [34, 31, -4.57411268111e-9, -1.60852780125e-9],
    [34, 32, 9.14033593474e-9, 2.31645138264e-9],
    [34, 33, 1.37617937967e-8, 4.3547198646e-9],
    [34, 34, -8.54011998155e-9, 1.65364599023e-9],
    [35, 0, 8.60443158492e-9, 0],
    [35, 1, -1.07631176168e-8, -1.03576288219e-8],
    [35, 2, -1.48166749807e-8, 7.47316845223e-9],
    [35, 3, 1.88623900305e-9, 3.49967679465e-9],
    [35, 4, -2.82338523108e-9, 9.20674937921e-9],
    [35, 5, -7.23688443416e-9, -1.15478796146e-8],
    [35, 6, 3.28708320436e-9, 7.90142264483e-9],
    [35, 7, -3.45829826367e-9, 4.71386839716e-9],
    [35, 8, 4.15911228686e-9, 9.21486965423e-9],
    [35, 9, -7.83584593022e-10, -1.08780700595e-9],
    [35, 10, -2.63078124596e-9, 1.14437669825e-8],
    [35, 11, 3.1135284219e-9, -3.11508942142e-9],
    [35, 12, 8.10432165903e-9, -6.4323395678e-9],
    [35, 13, -1.60870380988e-9, 3.02852925442e-9],
    [35, 14, -7.16511186947e-9, -7.02737046917e-9],
    [35, 15, -1.53690564123e-8, 8.75984924717e-9],
    [35, 16, -6.89772047703e-9, -7.36827047584e-9],
    [35, 17, 7.03755899027e-10, -8.82920485773e-9],
    [35, 18, -5.55247661498e-9, -1.14710477959e-8],
    [35, 19, -1.07112499273e-9, -3.41854119412e-9],
    [35, 20, 9.92702305837e-10, -1.13573745208e-10],
    [35, 21, 1.29333785663e-8, -8.17657795386e-10],
    [35, 22, 7.51479477595e-9, 5.7229930908e-9],
    [35, 23, -8.16391242216e-9, -2.22442612532e-9],
    [35, 24, 2.78435090517e-9, 6.38499607176e-9],
    [35, 25, 7.16858934156e-9, 1.99781103645e-9],
    [35, 26, -4.70300232305e-9, 4.61488943108e-9],
    [35, 27, 1.09602089094e-8, -1.33812635796e-8],
    [35, 28, 7.88159460716e-9, -1.53673024839e-8],
    [35, 29, 7.70786810766e-9, 3.40140754669e-9],
    [35, 30, -4.0519283993e-9, 2.87370616224e-9],
    [35, 31, 7.84140204315e-9, 4.0412480788e-9],
    [35, 32, -3.16267901777e-9, -7.41858064221e-9],
    [35, 33, 5.8609633966e-9, -3.07739390905e-9],
    [35, 34, -1.21632099674e-9, 2.66717400938e-9],
    [35, 35, -5.8786572941e-9, -5.01230638002e-9],
    [36, 0, -4.02590604243e-9, 0],
    [36, 1, -1.13386686386e-9, 5.14982653283e-9],
    [36, 2, -4.31575901448e-9, -3.40211031655e-9],
    [36, 3, 7.00409280444e-11, -1.58895672921e-8],
    [36, 4, 3.00961129935e-9, 1.38917218538e-9],
    [36, 5, -7.42261535513e-9, 1.4033786019e-9],
    [36, 6, 1.08546024568e-8, -3.16311943226e-9],
    [36, 7, 1.70813806147e-9, 6.17680210154e-9],
    [36, 8, 3.44939360246e-9, -5.03767857861e-9],
    [36, 9, 2.92192219493e-9, -3.74028113708e-10],
    [36, 10, 4.23119681703e-9, 6.83503143788e-9],
    [36, 11, -4.10039232642e-9, 4.75118294475e-9],
    [36, 12, 4.87204962837e-10, -9.84587714675e-9],
    [36, 13, -6.15416963507e-9, 8.0318113556e-9],
    [36, 14, -1.04141682764e-8, -5.94203574762e-9],
    [36, 15, 9.54892409044e-10, 3.33310574172e-9],
    [36, 16, 1.25505913598e-9, -1.60569406116e-10],
    [36, 17, 4.95066186034e-9, -8.65314022477e-9],
    [36, 18, 1.77184202015e-9, 4.4603340077e-9],
    [36, 19, -5.25149217565e-9, -6.65319486115e-9],
    [36, 20, -6.03793346956e-9, 3.52627660597e-9],
    [36, 21, 1.0690892473e-8, -5.67948915026e-9],
    [36, 22, 3.21356130034e-9, 1.61234121461e-9],
    [36, 23, -3.61160199501e-10, 2.74891917069e-9],
    [36, 24, 2.10662869987e-9, -4.24514998756e-9],
    [36, 25, 4.3497929214e-9, 1.5607147346e-8],
    [36, 26, 3.68762567031e-9, 9.37175113714e-9],
    [36, 27, -7.91229464362e-9, 8.8299681063e-9],
    [36, 28, 2.22637976824e-9, -4.34372617405e-9],
    [36, 29, 1.84511675839e-9, 2.0734471834e-10],
    [36, 30, -1.00411515955e-8, 6.05413293608e-9],
    [36, 31, -8.39084442298e-9, -5.54047445598e-9],
    [36, 32, 1.25654207109e-8, 2.30476235625e-9],
    [36, 33, 3.89957606637e-9, -3.50340856893e-9],
    [36, 34, -9.08693282663e-9, 4.35776976715e-9],
    [36, 35, -1.38812503272e-10, -1.25527291076e-8],
    [36, 36, 4.6014646572e-9, -5.94245336314e-9],
    [37, 0, -6.26877957928e-9, 0],
    [37, 1, -5.44321937673e-9, -1.11972040628e-9],
    [37, 2, -4.22246992954e-9, -1.37653686495e-8],
    [37, 3, -5.07190773652e-9, -7.09632763665e-10],
    [37, 4, 5.63543416051e-9, 4.45226138939e-10],
    [37, 5, -9.74378012077e-9, -5.57105900119e-10],
    [37, 6, -2.07367453469e-9, 7.87327801001e-9],
    [37, 7, 6.60599161587e-9, 8.67877271607e-9],
    [37, 8, -2.13258525895e-9, -2.1492307811e-9],
    [37, 9, 2.24091600442e-9, -1.86836328296e-9],
    [37, 10, 2.04157744229e-9, 2.3982604686e-9],
    [37, 11, 1.13497233805e-9, 3.68693317518e-9],
    [37, 12, -3.26021093974e-9, -5.25122926097e-9],
    [37, 13, -1.53850795393e-10, -8.31445713314e-9],
    [37, 14, -2.55036581184e-9, -1.12426375494e-9],
    [37, 15, 1.00390776044e-8, -9.42542010609e-10],
    [37, 16, 3.49368560629e-9, 1.33918670303e-8],
    [37, 17, 5.53414840336e-9, -4.2281622391e-9],
    [37, 18, 1.73316172415e-9, 3.80532044735e-9],
    [37, 19, -6.74770795135e-9, -5.73498587855e-10],
    [37, 20, -7.21680758206e-9, -1.01104023109e-9],
    [37, 21, 1.47579731962e-9, -1.50807662982e-9],
    [37, 22, 6.4953816483e-9, 2.8865990482e-10],
    [37, 23, -5.05603800386e-10, 4.15991942706e-9],
    [37, 24, -8.28158239621e-9, -8.7318975493e-9],
    [37, 25, 6.66433821456e-9, -1.98485329913e-9],
    [37, 26, 4.87667405785e-9, 1.0485263927e-8],
    [37, 27, -5.53507836078e-9, 4.40041559326e-9],
    [37, 28, 1.2711139402e-8, 3.98526299108e-9],
    [37, 29, 4.69346643521e-9, 6.80043694906e-9],
    [37, 30, -8.95069849852e-9, 1.25778887176e-8],
    [37, 31, 3.75470216864e-9, -9.24205129866e-9],
    [37, 32, -3.6924875074e-11, 3.99721827179e-9],
    [37, 33, 1.8187509055e-9, -1.66497614164e-8],
    [37, 34, 2.60762275923e-9, 5.18793036302e-10],
    [37, 35, -1.01969295005e-8, -8.48165557215e-9],
    [37, 36, -3.57377514832e-9, -4.80019536638e-9],
    [37, 37, 6.00401989218e-9, -4.34138083363e-9],
    [38, 0, -2.50215563904e-9, 0],
    [38, 1, 3.09466265187e-9, 4.69976367846e-9],
    [38, 2, 8.19190642499e-9, -2.92168742572e-10],
    [38, 3, -2.52647630895e-9, -9.33025608907e-10],
    [38, 4, 5.0736001792e-9, -4.18473896587e-9],
    [38, 5, -9.25037323666e-9, 7.38633376489e-9],
    [38, 6, -1.40048815273e-8, 3.14176171759e-9],
    [38, 7, 1.54501049189e-9, -2.78047841851e-9],
    [38, 8, 3.14019810906e-9, 4.33315196098e-9],
    [38, 9, 4.65473822686e-9, -7.83751300143e-10],
    [38, 10, -1.7720286584e-9, -6.3036900059e-9],
    [38, 11, 2.85477747534e-11, 8.94470323502e-9],
    [38, 12, -3.6131714659e-9, -6.75700770885e-9],
    [38, 13, 1.49004924856e-9, -1.04709970229e-8],
    [38, 14, -6.89357445422e-9, 3.94757501829e-9],
    [38, 15, 2.72024334119e-9, -3.29453926634e-9],
    [38, 16, -5.38417749949e-9, 9.7587426523e-9],
    [38, 17, 3.89428358456e-9, 2.01423843172e-9],
    [38, 18, 1.00538805145e-8, -2.61647337975e-9],
    [38, 19, 9.92881044511e-10, -6.15051964331e-10],
    [38, 20, 4.03103560658e-9, -2.09499348411e-9],
    [38, 21, -1.62423077972e-9, 3.92737997494e-9],
    [38, 22, 1.02706233144e-9, 7.86969415161e-9],
    [38, 23, -1.77955537988e-9, 5.41737892876e-9],
    [38, 24, -1.27705450894e-8, 1.14583893203e-9],
    [38, 25, -2.69917785699e-9, -2.26421240791e-9],
    [38, 26, -2.73518174387e-9, 6.15998595051e-9],
    [38, 27, -1.9219330356e-9, 8.73977778544e-9],
    [38, 28, -4.82197724567e-9, -5.18926025463e-9],
    [38, 29, 6.33489771869e-9, 3.2711837794e-9],
    [38, 30, -1.28143586175e-10, 2.16956419247e-9],
    [38, 31, 3.87663613104e-9, -7.68254138198e-9],
    [38, 32, 8.28751981049e-9, 1.78693515151e-9],
    [38, 33, 2.52385804563e-9, 1.42558825117e-8],
    [38, 34, -9.55299702793e-9, 3.2827417618e-9],
    [38, 35, 4.8092501395e-9, 2.33835491707e-9],
    [38, 36, 1.15090381132e-9, -6.84242268214e-10],
    [38, 37, -3.40978531559e-9, 2.06994207167e-9],
    [38, 38, 3.06349232433e-9, -2.13887850477e-9],
    [39, 0, 1.74080683553e-9, 0],
    [39, 1, -2.57053135612e-9, 5.38483681001e-9],
    [39, 2, 2.77228360729e-9, 7.04358259614e-9],
    [39, 3, -3.3235411877e-9, 6.24116116403e-9],
    [39, 4, -5.51535994529e-9, -4.91342654795e-9],
    [39, 5, 5.47040375439e-9, 1.66010698351e-9],
    [39, 6, -4.45909927931e-9, 2.79733582782e-9],
    [39, 7, 1.75001339201e-9, -1.65033123845e-9],
    [39, 8, 2.31145621942e-9, 1.15403393396e-8],
    [39, 9, 7.00349611111e-9, 3.7403056209e-9],
    [39, 10, 6.19713424433e-10, -2.78502502427e-10],
    [39, 11, 1.48793575424e-8, -2.39801529813e-9],
    [39, 12, -4.06774338685e-9, 8.93957638062e-9],
    [39, 13, -1.95237351388e-9, -7.71937180618e-9],
    [39, 14, -3.65216328534e-9, 2.78768320487e-9],
    [39, 15, -5.49236816801e-9, -3.97721347261e-10],
    [39, 16, 1.45206835528e-9, -1.85494879738e-9],
    [39, 17, -8.46839283593e-10, -1.46956096573e-9],
    [39, 18, 2.71275895976e-9, -8.67587317274e-10],
    [39, 19, 5.11240330583e-9, 6.2472795357e-9],
    [39, 20, -6.46282165404e-11, -9.92882773891e-9],
    [39, 21, -5.16094193773e-9, 1.94235688059e-9],
    [39, 22, -6.71243623487e-9, -8.06125497664e-10],
    [39, 23, -3.22921227535e-9, 5.92701141337e-9],
    [39, 24, -1.01882322024e-8, 7.75027644112e-9],
    [39, 25, -5.1284134163e-9, -6.30012789774e-9],
    [39, 26, -3.82452568811e-9, 8.65864300194e-9],
    [39, 27, -8.22525852368e-9, -2.01288638784e-9],
    [39, 28, -2.82378154145e-9, -1.06636607576e-8],
    [39, 29, -2.16515268074e-10, -3.06411648657e-9],
    [39, 30, 4.39099797319e-9, -1.05144274362e-8],
    [39, 31, 1.43579138969e-9, -1.13155001982e-8],
    [39, 32, 3.09632041312e-9, 5.55656199528e-9],
    [39, 33, -5.55441416143e-9, 3.56222456971e-9],
    [39, 34, -1.98688349566e-9, 3.36649788026e-9],
    [39, 35, -1.36024644629e-8, 2.22281004959e-9],
    [39, 36, 3.80530910326e-9, -3.45300476533e-9],
    [39, 37, 1.32324029653e-9, -4.53704470766e-9],
    [39, 38, -1.49988360222e-9, 6.44710228196e-9],
    [39, 39, -8.75284533601e-10, 1.3247277018e-9],
    [40, 0, -6.69712941605e-9, 0],
    [40, 1, 2.98119206129e-9, -1.67671602321e-10],
    [40, 2, -5.51229838204e-10, -1.11120907382e-9],
    [40, 3, 1.00967033874e-10, -2.06645039278e-9],
    [40, 4, 5.67371495728e-9, -7.21819587159e-9],
    [40, 5, 1.34270999896e-8, -1.89035912501e-10],
    [40, 6, -3.48436245779e-10, 4.26022856296e-9],
    [40, 7, -2.47450695737e-9, 2.38870112778e-9],
    [40, 8, 6.80794565632e-9, 3.82071234423e-9],
    [40, 9, -6.90490165958e-10, 1.97015196606e-9],
    [40, 10, -5.24806255604e-9, 3.06298214583e-9],
    [40, 11, 3.47677807871e-9, -4.16659562949e-9],
    [40, 12, 6.5461957328e-9, 1.94884088889e-10],
    [40, 13, -2.49110593073e-9, -4.29803550442e-9],
    [40, 14, -5.31990094342e-10, 9.00889321668e-10],
    [40, 15, -4.95474634955e-9, -5.73605310655e-10],
    [40, 16, -8.08969466066e-10, -3.3234849529e-9],
    [40, 17, 1.13076685092e-9, 1.87448317014e-9],
    [40, 18, -4.41879377259e-10, 7.15396759385e-10],
    [40, 19, -2.31075778003e-9, 7.40677714867e-10],
    [40, 20, -7.89936899784e-9, 6.9843429008e-9],
    [40, 21, -4.41475103069e-9, -6.44032174041e-10],
    [40, 22, -1.47137946197e-8, -1.57204038521e-8],
    [40, 23, -6.25564722188e-10, -1.23258449268e-8],
    [40, 24, 4.04206740773e-9, 3.83294965319e-9],
    [40, 25, 4.0630055543e-10, -4.16803630319e-9],
    [40, 26, 6.77364070024e-9, -4.63296622041e-9],
    [40, 27, -1.96935067826e-9, 1.67788741927e-9],
    [40, 28, 2.02303536054e-9, 7.02744988957e-9],
    [40, 29, 2.44543058163e-9, 2.15388613016e-9],
    [40, 30, 1.11163452352e-10, 1.06054076662e-9],
    [40, 31, -6.07985990106e-9, -1.40699197628e-9],
    [40, 32, -2.42536238693e-9, -5.77392178963e-9],
    [40, 33, -1.50936507352e-9, -9.12831329929e-10],
    [40, 34, 6.78276645979e-10, 9.66297773764e-10],
    [40, 35, 7.62262076875e-9, -8.42037138778e-9],
    [40, 36, 4.76306921308e-9, 5.09933668609e-9],
    [40, 37, -5.93199511085e-9, 1.63782612718e-9],
    [40, 38, 4.43681584183e-10, 4.45230470779e-9],
    [40, 39, 6.73138158452e-9, 3.1821410438e-9],
    [40, 40, -1.12228065052e-9, -2.25885618094e-10],
    [41, 0, -4.13525437499e-9, 0],
    [41, 1, -4.90274680015e-9, -4.1342146548e-9],
    [41, 2, 2.89052309474e-9, 1.77080262581e-9],
    [41, 3, 5.2084787981e-9, 2.62910180729e-9],
    [41, 4, -1.91230313597e-9, 4.99520425513e-9],
    [41, 5, 4.43964510122e-9, -3.40520164639e-9],
    [41, 6, 3.37316558839e-9, 2.0898518817e-9],
    [41, 7, 2.06227831355e-10, 3.27019848148e-9],
    [41, 8, -2.15120846029e-9, -4.24645658621e-9],
    [41, 9, -5.91413129556e-10, 3.43780205286e-9],
    [41, 10, 4.97937264743e-9, 1.52629699723e-9],
    [41, 11, 5.1207311293e-9, -6.76355555964e-9],
    [41, 12, 4.56242438597e-9, 4.26145632589e-10],
    [41, 13, -1.9035041822e-9, 4.24220010125e-9],
    [41, 14, 4.13463016104e-9, -1.22583182109e-9],
    [41, 15, -1.24689685661e-9, 3.06681470819e-9],
    [41, 16, -6.34747121526e-10, -4.30865119854e-9],
    [41, 17, -2.0687663455e-9, 3.54231837608e-9],
    [41, 18, -2.25848220691e-9, 4.38915638181e-9],
    [41, 19, -2.87905409333e-9, -6.98556578723e-10],
    [41, 20, -2.22610632963e-9, -6.84339949215e-10],
    [41, 21, -1.35557598574e-9, -3.86965990217e-9],
    [41, 22, -1.08213659346e-8, -3.18900609762e-9],
    [41, 23, 9.05820361427e-10, -1.56187984663e-8],
    [41, 24, 6.16778124863e-9, -1.60878624414e-9],
    [41, 25, 3.53851984061e-10, 3.05984309642e-9],
    [41, 26, 7.54848875117e-9, -8.45787453799e-9],
    [41, 27, 1.64116433803e-9, -4.05578278772e-10],
    [41, 28, -1.65098951199e-9, -4.69639162983e-9],
    [41, 29, -5.44379585832e-9, 6.37658266351e-9],
    [41, 30, 2.22402442097e-9, -4.31030185329e-10],
    [41, 31, 1.07361998502e-8, 1.05556071175e-9],
    [41, 32, -2.67267671294e-9, 3.89646604453e-9],
    [41, 33, -3.34120765867e-9, 1.05367869266e-8],
    [41, 34, -2.88895264308e-9, 4.05911712157e-9],
    [41, 35, -1.37509044416e-8, 2.84446968017e-9],
    [41, 36, 3.63761204387e-9, -3.62427981439e-9],
    [41, 37, 1.80748235308e-9, -1.08907704575e-8],
    [41, 38, -1.05887784161e-8, -5.38192890554e-10],
    [41, 39, -5.23876130159e-9, -3.06101814034e-9],
    [41, 40, 4.2197139814e-9, -4.81844784939e-9],
    [41, 41, 4.33049994846e-9, 7.11601184478e-9],
    [42, 0, -1.33354792115e-9, 0],
    [42, 1, -2.91339767022e-9, 2.0672296144e-9],
    [42, 2, -2.25762740342e-9, -1.91350575326e-9],
    [42, 3, 1.00425868132e-9, 8.90566423709e-9],
    [42, 4, 5.4929304912e-9, 1.46033051568e-9],
    [42, 5, -9.14060768047e-9, -4.05025465516e-9],
    [42, 6, 2.51909112593e-9, -8.30414001349e-10],
    [42, 7, 4.33149903326e-9, -1.81867645319e-9],
    [42, 8, 2.3146703672e-9, 6.46886557966e-10],
    [42, 9, 5.80415766535e-10, 2.63924873014e-9],
    [42, 10, 5.35861538963e-9, 6.87237624774e-9],
    [42, 11, -8.10356263273e-10, 2.77288086748e-9],
    [42, 12, 5.18833931987e-9, -1.0630088118e-8],
    [42, 13, 6.96174131569e-10, 5.52240053377e-9],
    [42, 14, -6.83414603737e-9, 5.97533344532e-9],
    [42, 15, -1.15265842427e-9, 6.35337004364e-9],
    [42, 16, 2.71346710242e-9, -2.38502668497e-9],
    [42, 17, -1.79870822529e-9, -4.10981715056e-9],
    [42, 18, -1.31441814882e-8, 1.7880048219e-9],
    [42, 19, -2.80886446365e-9, -5.88853392034e-9],
    [42, 20, 5.67492620331e-9, 6.40791629469e-10],
    [42, 21, 2.41505414934e-9, -5.60737090588e-9],
    [42, 22, 1.51381190151e-9, -3.40250947394e-9],
    [42, 23, -3.27844335846e-9, -5.63629938986e-9],
    [42, 24, 4.82256426682e-9, 1.2093961296e-9],
    [42, 25, -4.25447876888e-9, 4.34304889131e-9],
    [42, 26, -1.78154712795e-9, -6.25459866853e-9],
    [42, 27, 8.06048401324e-9, -2.34473408874e-9],
    [42, 28, -3.52264845834e-9, 1.96484652934e-9],
    [42, 29, -6.52976748285e-9, -1.27865281867e-9],
    [42, 30, 2.96168915407e-9, 1.45345501063e-9],
    [42, 31, 5.22771935211e-9, 4.84294083994e-9],
    [42, 32, 7.00967483397e-9, 5.21635005469e-9],
    [42, 33, 5.68419870673e-9, 5.8209226949e-9],
    [42, 34, 2.49133780205e-9, 1.11560909802e-8],
    [42, 35, -5.42518392886e-9, -1.14422610701e-9],
    [42, 36, 4.43062694275e-9, -5.4015923669e-9],
    [42, 37, -5.90537874418e-9, 2.38447105699e-9],
    [42, 38, 2.61875328309e-9, -1.31646034318e-8],
    [42, 39, 4.31141960605e-9, 1.02533250717e-8],
    [42, 40, 1.48071523979e-9, -2.90013620439e-9],
    [42, 41, 1.46208018106e-9, 2.15712294638e-11],
    [42, 42, -7.17896151918e-9, 3.05774241943e-9],
    [43, 0, 4.80016559571e-9, 0],
    [43, 1, -2.99163512748e-9, 1.40510371892e-9],
    [43, 2, -9.95536520455e-9, -6.78259699473e-10],
    [43, 3, 3.1691808399e-9, -1.5749811091e-10],
    [43, 4, 1.18935531794e-9, 1.81393420291e-9],
    [43, 5, -8.80529783351e-9, 7.1635769111e-9],
    [43, 6, 5.97894057386e-9, 2.94590894949e-10],
    [43, 7, -1.52227392816e-9, 4.89580125606e-9],
    [43, 8, 5.57502878273e-11, 2.79898709198e-10],
    [43, 9, -2.42188694717e-9, -7.0904649618e-9],
    [43, 10, 2.87637569429e-10, 1.9008191519e-9],
    [43, 11, -3.43518224791e-9, 5.95350214203e-9],
    [43, 12, -2.47269924155e-9, 1.92210904294e-9],
    [43, 13, 1.96966119784e-9, -3.46114343345e-9],
    [43, 14, -5.66818876142e-9, 3.25629579061e-9],
    [43, 15, 3.54766446436e-9, 5.99511981789e-9],
    [43, 16, 2.73311624814e-10, 2.77229088669e-10],
    [43, 17, 3.94232906593e-9, -4.53197550515e-9],
    [43, 18, -3.66329200365e-9, -5.14114571097e-9],
    [43, 19, -4.35166062861e-9, -7.09815995277e-9],
    [43, 20, -6.95761972986e-10, 3.54067077072e-10],
    [43, 21, 3.89994250134e-9, 4.95534624419e-9],
    [43, 22, 6.92777454917e-9, -1.96608582659e-9],
    [43, 23, 4.67099532626e-10, -6.08055780558e-9],
    [43, 24, 6.38614148731e-9, -1.7118365038e-9],
    [43, 25, 4.2200639481e-10, 3.20173896008e-9],
    [43, 26, -3.49775086562e-9, 3.5714429196e-9],
    [43, 27, 4.3488792847e-9, 8.99989867635e-10],
    [43, 28, -9.57727739574e-10, 7.92898192789e-9],
    [43, 29, -1.05147757759e-9, 1.14886926559e-9],
    [43, 30, -1.03596839492e-8, -8.23488791643e-9],
    [43, 31, -4.53706035433e-9, -8.68509261457e-10],
    [43, 32, -3.64072761092e-9, 5.35143529179e-9],
    [43, 33, 6.05006717058e-9, -1.14065559763e-9],
    [43, 34, 2.98956472143e-9, 4.16161397827e-10],
    [43, 35, -1.28808244727e-9, 5.5058202819e-9],
    [43, 36, 6.52903431778e-10, -3.62994807787e-9],
    [43, 37, 3.17344593362e-9, 6.0114715157e-9],
    [43, 38, -5.81895814117e-9, 1.74812579571e-10],
    [43, 39, 4.9632420451e-9, -2.39546876633e-9],
    [43, 40, 1.15985754714e-8, 5.03199216333e-11],
    [43, 41, -3.16787886818e-9, 3.1247340099e-9],
    [43, 42, -7.44030943275e-9, 4.27834690972e-9],
    [43, 43, -2.08475180681e-9, -8.96658973671e-9],
    [44, 0, 7.16597271169e-10, 0],
    [44, 1, 4.35359549773e-9, -8.03476202214e-10],
    [44, 2, -3.79120724365e-10, 2.3666343415e-9],
    [44, 3, -1.9504287923e-10, -3.50189431483e-9],
    [44, 4, 2.63812172722e-9, -2.14241109485e-9],
    [44, 5, 1.22484173172e-9, 3.33912238312e-9],
    [44, 6, -8.21665290321e-9, 3.4257080463e-9],
    [44, 7, 2.98851621414e-9, 1.04600848746e-8],
    [44, 8, -2.65553732502e-9, 3.88452130213e-10],
    [44, 9, -4.01226877626e-10, -6.42838063306e-9],
    [44, 10, -5.27891450116e-9, -6.09599870123e-9],
    [44, 11, -2.17005646338e-9, -1.09791269121e-9],
    [44, 12, -4.43983695521e-9, -2.18899413884e-9],
    [44, 13, 2.53662498828e-9, -4.26751504379e-9],
    [44, 14, -5.40774676176e-9, -3.74724128584e-9],
    [44, 15, 2.20273327242e-9, -6.38441090011e-9],
    [44, 16, 4.56597166511e-9, 4.84573915246e-9],
    [44, 17, 4.41544557049e-9, 1.54202418543e-9],
    [44, 18, 5.67906570443e-9, -4.17559338192e-9],
    [44, 19, -6.73447447471e-10, -4.67189791645e-9],
    [44, 20, -4.56157353263e-10, 6.30312848084e-10],
    [44, 21, -7.37736788113e-9, 1.98663767921e-10],
    [44, 22, 6.92875962848e-9, 2.07109499562e-9],
    [44, 23, 1.01550408795e-9, 9.64945379654e-9],
    [44, 24, 3.01922142612e-10, -6.513423277e-9],
    [44, 25, 2.90361579607e-9, 1.10661300138e-9],
    [44, 26, -4.47876001353e-9, 1.27891412067e-9],
    [44, 27, 2.51551011801e-9, -2.77043411393e-9],
    [44, 28, -9.05678632717e-10, 5.54494660787e-9],
    [44, 29, -6.98866052227e-9, 4.49026748788e-9],
    [44, 30, 4.7898160503e-9, 1.82143100801e-9],
    [44, 31, -6.34603270453e-10, 2.65129335221e-9],
    [44, 32, -4.23584657112e-9, 7.9819136238e-10],
    [44, 33, -3.75671392995e-9, 2.89954282777e-10],
    [44, 34, -3.34592062957e-9, 5.90112277368e-9],
    [44, 35, -7.42209126379e-9, -3.12651333437e-9],
    [44, 36, 3.53465103361e-9, -7.50792765314e-9],
    [44, 37, 9.77743329493e-9, 7.49175946104e-9],
    [44, 38, 4.50523562078e-9, -6.07722887364e-9],
    [44, 39, 6.82723600826e-9, 2.67191354166e-9],
    [44, 40, -3.60229735e-9, 7.43640660818e-9],
    [44, 41, 3.05918358946e-9, -2.19975922856e-9],
    [44, 42, -8.04752620611e-10, -7.48815852958e-10],
    [44, 43, 2.63803620047e-9, -3.00616063432e-9],
    [44, 44, 3.0291478328e-9, -1.61647243103e-9],
    [45, 0, -4.20562194155e-9, 0],
    [45, 1, 4.4379040152e-9, -5.51664132292e-9],
    [45, 2, 1.18458145711e-9, -2.84426726042e-9],
    [45, 3, -3.07024006065e-10, -6.08323666779e-9],
    [45, 4, -4.17074572514e-10, 1.04795469653e-9],
    [45, 5, 3.13251669316e-9, -1.38672272733e-9],
    [45, 6, -5.58127842237e-9, -4.54711073566e-10],
    [45, 7, 1.44970124311e-12, 2.60316093604e-9],
    [45, 8, -3.54978919718e-9, 4.56563662187e-10],
    [45, 9, 6.83145300281e-9, -4.64843734135e-9],
    [45, 10, -1.37244511558e-9, -2.43311008683e-9],
    [45, 11, 1.14821963863e-9, -2.97387745235e-9],
    [45, 12, -4.8209597262e-9, -2.34153494603e-9],
    [45, 13, -4.91603699064e-9, -2.88944934821e-9],
    [45, 14, 2.19473571181e-9, -5.06957047369e-9],
    [45, 15, -3.14892757709e-9, -1.49587086033e-12],
    [45, 16, 6.63161850196e-9, 4.6755213631e-10],
    [45, 17, 2.49597156408e-9, -1.67690334522e-9],
    [45, 18, 2.45467637342e-9, -4.28899068529e-9],
    [45, 19, -5.13137394149e-9, -2.2131490841e-9],
    [45, 20, 5.56074699836e-9, 4.14250381261e-9],
    [45, 21, -3.4690949332e-9, -5.58876832906e-10],
    [45, 22, 3.18548582181e-9, 5.02694389287e-9],
    [45, 23, 2.22520273984e-9, 5.15834114168e-9],
    [45, 24, -1.10386430944e-8, 4.66294947782e-9],
    [45, 25, 8.186396108e-9, -3.38119094674e-9],
    [45, 26, -2.17829767335e-9, 5.90422271735e-9],
    [45, 27, -6.37212275736e-9, 3.42683611366e-10],
    [45, 28, 5.55768024188e-9, -1.53492742026e-10],
    [45, 29, -7.56151876206e-9, -2.5200914351e-9],
    [45, 30, -1.78204385866e-9, -1.16576354142e-10],
    [45, 31, -1.81647075569e-9, -4.89659964022e-9],
    [45, 32, -2.17318403448e-9, -2.98137538631e-9],
    [45, 33, -1.67787477837e-9, -2.76303095452e-9],
    [45, 34, -2.45868539182e-9, 6.10049182142e-9],
    [45, 35, -7.25160877101e-9, 7.14795060372e-9],
    [45, 36, -8.31520827869e-9, 6.91473231707e-9],
    [45, 37, -5.90075989395e-9, 3.86510419611e-9],
    [45, 38, -4.5757545766e-9, 3.51994877415e-9],
    [45, 39, -2.35206857136e-10, -8.14244952898e-9],
    [45, 40, 4.12959194689e-9, -3.33153350192e-9],
    [45, 41, 1.15177501806e-9, 1.23563176111e-9],
    [45, 42, -1.47954611149e-9, -1.19573121446e-8],
    [45, 43, 4.29208492389e-9, 2.4169691253e-9],
    [45, 44, 1.16896020112e-8, 3.79338157974e-9],
    [45, 45, -2.11611455548e-9, -1.86268283322e-10],
    [46, 0, -2.70012415043e-9, 0],
    [46, 1, 1.80310534813e-9, 1.01975529719e-9],
    [46, 2, 5.49858950643e-9, 1.69386192791e-9],
    [46, 3, -2.17227347292e-9, 3.13551620449e-11],
    [46, 4, 5.66307366242e-10, -7.33552916811e-9],
    [46, 5, -3.92225673604e-9, -9.87938446292e-9],
    [46, 6, -5.19790587846e-9, -3.66545255275e-9],
    [46, 7, 5.4928302123e-9, -7.68195997713e-9],
    [46, 8, 2.17033095777e-9, 3.17787787443e-9],
    [46, 9, 9.96299925061e-9, 5.93033350714e-9],
    [46, 10, 2.10682665579e-9, -7.49320315546e-10],
    [46, 11, -3.67331003264e-9, -3.29875222753e-9],
    [46, 12, -9.89004146632e-10, -7.70280415669e-10],
    [46, 13, -5.4749365389e-9, -9.89789200776e-10],
    [46, 14, -4.11711385409e-10, 2.899684764e-10],
    [46, 15, -5.64698395869e-9, -2.33049143886e-9],
    [46, 16, 2.90741518386e-9, 5.43626943521e-9],
    [46, 17, -3.72824213792e-9, -6.68397143095e-10],
    [46, 18, 2.54614482597e-9, -5.15577393539e-9],
    [46, 19, -5.09322881303e-10, -2.19142742197e-9],
    [46, 20, -3.2604694877e-9, -4.45892855672e-9],
    [46, 21, -5.44320195164e-9, 4.86393178127e-9],
    [46, 22, 6.01189717955e-9, 1.1853935729e-9],
    [46, 23, 2.49813551913e-9, 4.72263592598e-9],
    [46, 24, -4.67893359545e-9, -3.01740256772e-10],
    [46, 25, 4.11819342344e-9, -7.98076733908e-9],
    [46, 26, 3.90445251962e-9, 1.09137918441e-8],
    [46, 27, -2.31459572299e-9, -1.31245150309e-10],
    [46, 28, -5.12497482609e-10, -5.28211928064e-9],
    [46, 29, -2.20883312544e-9, -2.10749632839e-9],
    [46, 30, -5.25781051372e-9, -7.85075749498e-9],
    [46, 31, -2.42154487807e-9, 8.85282307696e-11],
    [46, 32, -1.70076318965e-9, -3.12034919855e-9],
    [46, 33, 1.49941290882e-8, -2.89411008422e-10],
    [46, 34, -1.77925513543e-9, 4.03871357436e-9],
    [46, 35, -6.42883444376e-9, 9.61561249861e-10],
    [46, 36, -2.62783231385e-10, -2.29487440393e-9],
    [46, 37, -3.72932026305e-9, 6.20601539446e-9],
    [46, 38, -6.23587949535e-9, -2.84455158644e-9],
    [46, 39, 7.90167444535e-9, -6.70704239494e-10],
    [46, 40, 1.17802075978e-9, -1.17881775587e-9],
    [46, 41, -3.7054949246e-10, -5.22404669093e-9],
    [46, 42, 9.59291977084e-10, 6.55323402052e-9],
    [46, 43, -2.40852741746e-9, 1.17616421703e-8],
    [46, 44, 2.23574532165e-9, -3.22855904393e-9],
    [46, 45, -1.71783716222e-9, 5.66851692385e-9],
    [46, 46, -4.19103472438e-10, -2.96575033763e-9],
    [47, 0, -1.90154208615e-10, 0],
    [47, 1, -6.27233433754e-9, -1.5151751449e-9],
    [47, 2, 4.016915657e-9, -1.00085045221e-9],
    [47, 3, 2.59377856501e-9, 2.47231037816e-9],
    [47, 4, -1.04443325244e-9, 9.34975462359e-10],
    [47, 5, -4.31347537978e-10, -2.20359402651e-9],
    [47, 6, 2.57405615983e-9, -3.41622421012e-9],
    [47, 7, 3.52747810143e-10, -3.93728849468e-9],
    [47, 8, 5.37524591361e-9, -1.23956249318e-9],
    [47, 9, -1.29987202635e-9, 2.95555821523e-9],
    [47, 10, 6.40767701595e-9, 3.68885075423e-9],
    [47, 11, 1.23519925844e-9, -4.72211607105e-9],
    [47, 12, 1.04380948619e-8, 2.75422690346e-9],
    [47, 13, -2.71006312178e-9, -3.33560490463e-9],
    [47, 14, 1.07598358729e-9, 4.79188752249e-10],
    [47, 15, -1.85179314652e-9, 1.00741967568e-9],
    [47, 16, -2.04122754813e-9, -7.74824254825e-10],
    [47, 17, -1.85094389869e-9, 4.70534852733e-9],
    [47, 18, -1.75664412977e-9, 7.51634026147e-9],
    [47, 19, 2.57958630199e-9, 3.90203858436e-9],
    [47, 20, -1.11333666318e-8, 1.9693962829e-10],
    [47, 21, -5.99568152704e-9, 1.11135984769e-10],
    [47, 22, -7.56627176425e-9, -9.65217141462e-10],
    [47, 23, 3.09665406126e-9, 9.94928294714e-10],
    [47, 24, -1.17285978776e-9, -1.1322436378e-9],
    [47, 25, -2.64542435507e-9, -9.91886685629e-9],
    [47, 26, 8.3971878012e-9, 2.93025050389e-10],
    [47, 27, -6.10514707418e-9, -2.63190397426e-9],
    [47, 28, 1.67058013297e-9, -6.84529247699e-9],
    [47, 29, 5.86653254012e-9, 1.39919470636e-11],
    [47, 30, -2.42054755734e-9, 2.4590389349e-9],
    [47, 31, 5.19770268779e-10, 9.51714424649e-10],
    [47, 32, -1.60020222792e-9, -1.57189568068e-10],
    [47, 33, -4.66270294962e-9, 2.69393960951e-9],
    [47, 34, 1.86438558801e-9, 3.68745885093e-9],
    [47, 35, -9.09257444193e-9, 1.08683931287e-9],
    [47, 36, 7.40829517963e-9, -4.3469106059e-9],
    [47, 37, 8.22769659281e-9, 1.65695541642e-9],
    [47, 38, 6.47827986587e-11, 1.36944595156e-9],
    [47, 39, -1.85449646925e-9, 7.6698755501e-9],
    [47, 40, -8.50173620087e-9, 7.89172031519e-9],
    [47, 41, -3.6893598523e-9, 4.90097673006e-9],
    [47, 42, -1.59039873565e-9, -5.52446047641e-9],
    [47, 43, 2.23824882871e-9, 2.73410283112e-9],
    [47, 44, -3.41312191572e-9, 1.04347201947e-8],
    [47, 45, 6.21033825189e-9, 2.30263608837e-9],
    [47, 46, -2.58602557996e-10, -4.32960943537e-9],
    [47, 47, 3.28878760211e-9, -5.01440887217e-9],
    [48, 0, 3.57681178108e-9, 0],
    [48, 1, 1.14968699435e-9, 3.02657013283e-9],
    [48, 2, 4.52034385436e-9, 3.63393017349e-10],
    [48, 3, -1.22927584235e-9, 2.57979302487e-9],
    [48, 4, 4.09341959566e-10, -1.22080534781e-9],
    [48, 5, 5.43663455799e-9, -2.35605380481e-9],
    [48, 6, 4.74904020601e-9, 7.84843721779e-9],
    [48, 7, -3.98978873322e-10, 2.48163262176e-9],
    [48, 8, 2.55845111826e-9, 5.47396371892e-9],
    [48, 9, 2.24130678348e-10, 3.98795187238e-9],
    [48, 10, -3.53158299606e-9, 3.04470802332e-9],
    [48, 11, 1.38179707639e-9, 1.07320251723e-9],
    [48, 12, 9.19794499549e-11, -3.8310242456e-9],
    [48, 13, 2.8444543846e-9, 1.67644943899e-9],
    [48, 14, -4.17415239884e-10, -5.20890517219e-10],
    [48, 15, 4.62182206593e-9, 1.74541145074e-9],
    [48, 16, 8.55310905864e-10, 9.6417817961e-10],
    [48, 17, 1.03882489053e-9, 3.58612272501e-9],
    [48, 18, -6.51833456414e-10, 1.74602237769e-9],
    [48, 19, -2.27428315047e-9, 4.71978277111e-9],
    [48, 20, -5.25895902263e-9, 5.05947018014e-9],
    [48, 21, 4.19950564694e-10, -3.37394929243e-9],
    [48, 22, -7.46739493756e-9, 2.78688711358e-9],
    [48, 23, -2.06870163398e-9, -2.40698779384e-9],
    [48, 24, -4.28479149016e-9, -9.29222791824e-10],
    [48, 25, -3.13816367488e-9, 3.53860016527e-10],
    [48, 26, 6.75317050852e-10, -5.81365414694e-9],
    [48, 27, -8.14262299853e-9, 4.75300683514e-9],
    [48, 28, 6.19117211259e-10, -7.45017826902e-9],
    [48, 29, 2.08270824932e-9, -6.70725670829e-9],
    [48, 30, -1.21014652961e-9, -1.35952580674e-9],
    [48, 31, 2.1892623948e-10, -3.84588314583e-9],
    [48, 32, 1.75493280857e-9, -1.71734501643e-9],
    [48, 33, 2.03034126664e-9, -1.19209199438e-10],
    [48, 34, 7.36341492206e-10, 7.2488084141e-9],
    [48, 35, -5.46003431694e-9, 1.26320884899e-9],
    [48, 36, -4.57823041568e-9, -6.44850201282e-10],
    [48, 37, -1.77867917025e-9, -4.54304954485e-9],
    [48, 38, -8.7354735732e-9, -1.03193513201e-9],
    [48, 39, 5.12226006557e-9, -8.69537994667e-9],
    [48, 40, 1.43385239699e-9, 4.95029164361e-9],
    [48, 41, -2.36089936238e-9, -9.76362693271e-9],
    [48, 42, 1.91874768918e-9, 2.84547987611e-9],
    [48, 43, 4.86940216197e-9, 5.83862929544e-9],
    [48, 44, 6.53859055177e-10, -1.20865612683e-10],
    [48, 45, 5.62863159319e-9, 4.73507339015e-9],
    [48, 46, -3.68918092552e-9, 8.75444855625e-9],
    [48, 47, 3.19161830766e-9, 4.52954726663e-9],
    [48, 48, 6.09574598027e-9, -1.46002611039e-9],
    [49, 0, -1.32381251748e-10, 0],
    [49, 1, 6.47068277627e-9, -2.37896141041e-10],
    [49, 2, 1.30200427546e-10, 3.00456443547e-9],
    [49, 3, 1.43748218598e-9, 1.44670309978e-9],
    [49, 4, -3.92329568744e-10, 9.70388035448e-9],
    [49, 5, 2.55429460233e-9, -1.47768022073e-10],
    [49, 6, -2.11376664553e-9, 3.43832599943e-9],
    [49, 7, 3.15330040886e-9, 3.41943534957e-9],
    [49, 8, -1.06674914362e-9, 3.72669749638e-9],
    [49, 9, -8.15488716734e-10, 5.5538171239e-9],
    [49, 10, -4.96678560171e-9, -3.87168385069e-10],
    [49, 11, 4.84062216988e-9, 2.23790617673e-9],
    [49, 12, -3.20337407762e-9, -2.02737537475e-9],
    [49, 13, 2.49812725043e-9, 3.72762188228e-9],
    [49, 14, 6.34349028568e-10, -1.58167593564e-9],
    [49, 15, -1.99198762809e-9, 1.1277422647e-9],
    [49, 16, -1.23336400479e-9, -5.94456540806e-9],
    [49, 17, -2.65699702032e-9, -6.1024816469e-10],
    [49, 18, -1.31402173323e-9, -2.43782519231e-9],
    [49, 19, -2.29688343083e-9, -4.94180521317e-10],
    [49, 20, 4.66871394808e-9, 3.07127632185e-10],
    [49, 21, -2.08989346555e-9, -5.88434524195e-9],
    [49, 22, 1.91135216096e-10, 4.43491281302e-9],
    [49, 23, 2.99871273075e-9, -1.06379105793e-9],
    [49, 24, 4.3599603262e-9, 1.42678862473e-9],
    [49, 25, -4.6015682674e-9, 5.38503141399e-9],
    [49, 26, -7.84845559049e-9, -9.76933411644e-10],
    [49, 27, -3.04318299143e-9, 2.74872232195e-9],
    [49, 28, -3.23017753759e-9, -1.12284746533e-8],
    [49, 29, 6.64106165101e-10, -5.71670663706e-10],
    [49, 30, 2.48126870469e-9, 2.85895832102e-9],
    [49, 31, -2.48689123925e-10, -6.18384284875e-9],
    [49, 32, 1.37336318711e-9, -5.66667653145e-9],
    [49, 33, 1.5107853166e-9, -1.8527574247e-9],
    [49, 34, 4.48621700339e-9, -5.35447038422e-10],
    [49, 35, 2.84135954695e-9, 5.53605102488e-9],
    [49, 36, -4.73460942936e-9, 5.77800653513e-10],
    [49, 37, -1.00375346312e-9, 9.2788284134e-10],
    [49, 38, 3.10296657267e-9, -2.41249789431e-9],
    [49, 39, 2.82835885902e-9, 2.26214345333e-9],
    [49, 40, -1.76894208328e-9, 1.90525031142e-9],
    [49, 41, -1.78869741196e-9, -1.47482017451e-9],
    [49, 42, -2.88796879506e-9, -4.84058674322e-10],
    [49, 43, 5.04557010898e-9, -6.87856526043e-9],
    [49, 44, 5.93483174278e-9, 8.10527467719e-9],
    [49, 45, 8.78294012586e-10, -1.5462879946e-9],
    [49, 46, 3.32223141812e-9, 1.32061609167e-9],
    [49, 47, 2.19546558739e-9, 4.45577322906e-10],
    [49, 48, -3.19934645334e-9, 5.29796611163e-10],
    [49, 49, 3.53298458012e-9, 1.15517660073e-9],
    [50, 0, -3.7612715508e-9, 0],
    [50, 1, 4.23888304609e-9, -1.50227955046e-9],
    [50, 2, -8.61644685578e-9, -3.18340545864e-9],
    [50, 3, 6.5481484883e-10, -1.0655411174e-9],
    [50, 4, -8.48878564001e-9, 4.0721357789e-10],
    [50, 5, -7.58945358323e-10, -2.79474626471e-9],
    [50, 6, -8.05947626804e-11, 1.79661231497e-9],
    [50, 7, 2.14183539023e-9, 4.51809743818e-9],
    [50, 8, -2.72537670208e-9, 1.14829252929e-9],
    [50, 9, -1.44509891184e-9, 2.53472803309e-9],
    [50, 10, -4.89799910812e-9, -3.57698633382e-10],
    [50, 11, -2.94734601071e-9, 1.94786708736e-9],
    [50, 12, -4.05382587198e-9, 5.023916574e-9],
    [50, 13, -6.35513582256e-10, 1.3970525603e-9],
    [50, 14, -3.79816827726e-9, 4.20446479492e-9],
    [50, 15, -3.40693142635e-9, -1.76525731032e-9],
    [50, 16, -2.12579920433e-9, -4.97850923583e-9],
    [50, 17, 1.69417034762e-10, -3.84471197721e-9],
    [50, 18, 6.36885232786e-10, -4.4988101164e-9],
    [50, 19, 6.43391947467e-10, 3.15512282312e-11],
    [50, 20, 2.08558685488e-9, -2.37194017815e-9],
    [50, 21, -6.27546236058e-10, -8.81913916952e-10],
    [50, 22, 2.61749141861e-9, -4.96032655871e-10],
    [50, 23, -1.67352954824e-9, -5.5835171504e-9],
    [50, 24, 1.04263288641e-8, 5.32645409553e-11],
    [50, 25, 4.58248696956e-9, 3.39769216723e-9],
    [50, 26, -8.4872906046e-9, -1.81083249791e-9],
    [50, 27, 5.47669956008e-9, -2.51696510797e-9],
    [50, 28, -7.44617458853e-10, 5.58609205114e-9],
    [50, 29, 6.06026089459e-9, 2.80947566572e-9],
    [50, 30, 4.31969594552e-9, 6.41393913595e-9],
    [50, 31, -2.84620436283e-9, 5.88802189362e-9],
    [50, 32, -1.62497922734e-9, 2.05646822412e-9],
    [50, 33, -4.60525159016e-9, -2.82170522547e-9],
    [50, 34, -8.46646934969e-10, -2.72923357121e-9],
    [50, 35, 1.19140447708e-9, 2.06743519414e-11],
    [50, 36, 2.13633970167e-11, 4.5086936057e-11],
    [50, 37, -7.33835011531e-10, -1.41287700458e-9],
    [50, 38, -1.02410062837e-9, -5.63553141539e-9],
    [50, 39, -5.29540912171e-9, 9.19458922215e-9],
    [50, 40, 2.8748648716e-9, 6.34128761784e-9],
    [50, 41, -6.35872270084e-9, -4.96647387289e-9],
    [50, 42, 5.69964345835e-9, -4.0966438718e-9],
    [50, 43, -5.25670953923e-10, -2.39743492902e-9],
    [50, 44, 8.10754440067e-11, -1.0456062211e-9],
    [50, 45, -3.14926097646e-9, 5.12174359323e-9],
    [50, 46, -4.25352776842e-9, 1.83310979154e-9],
    [50, 47, -5.60348447199e-9, -1.12656390145e-8],
    [50, 48, 9.53309070729e-10, -3.0274013527e-10],
    [50, 49, 2.27056130491e-9, -4.59809288584e-9],
    [50, 50, 5.43852125284e-9, 1.48027432095e-9],
    [51, 0, -4.78852906152e-9, 0],
    [51, 1, 1.65448879203e-9, 3.0949690017e-9],
    [51, 2, -6.91163230511e-9, -1.02424145195e-9],
    [51, 3, -4.45072990548e-9, -7.397839007e-9],
    [51, 4, 1.0786209386e-9, 2.38350141509e-9],
    [51, 5, -2.99281893891e-9, -3.75648728774e-9],
    [51, 6, 9.69683625382e-10, -3.24821242044e-9],
    [51, 7, -1.33631031315e-9, 3.13043952153e-9],
    [51, 8, 1.40076132569e-9, 4.31755870883e-9],
    [51, 9, -9.80604470473e-10, -3.70145819407e-9],
    [51, 10, 3.78436368064e-9, -2.65266824717e-9],
    [51, 11, -3.74059224395e-9, 2.01615715509e-10],
    [51, 12, -4.46097494783e-9, 1.95046274671e-9],
    [51, 13, -1.00647188903e-8, -9.35483871177e-10],
    [51, 14, 1.59662682825e-9, 3.09998025659e-10],
    [51, 15, 8.69325090323e-10, -7.1324238697e-10],
    [51, 16, -1.55429120706e-9, -1.71810008494e-9],
    [51, 17, 3.68342905878e-9, -7.85957237694e-10],
    [51, 18, 1.46813444457e-9, -7.16778610111e-10],
    [51, 19, 7.80408755157e-10, -2.37742618011e-10],
    [51, 20, 5.47640650181e-10, 3.14260512103e-11],
    [51, 21, 1.57213788884e-9, 9.43981648887e-10],
    [51, 22, -2.93201598437e-9, -2.68766846418e-9],
    [51, 23, -2.2669618668e-9, 2.44336906441e-9],
    [51, 24, 3.59980107911e-9, -6.25545175651e-9],
    [51, 25, 6.79169423684e-9, -9.23894591596e-10],
    [51, 26, -1.29912779158e-9, -3.69475569102e-9],
    [51, 27, 4.83522731978e-9, -8.5647657332e-9],
    [51, 28, 3.58441313397e-9, 6.6754647893e-9],
    [51, 29, -2.42183222058e-9, 1.47517738461e-9],
    [51, 30, 1.72557928699e-9, 3.32303426609e-9],
    [51, 31, 3.69498751102e-11, 5.06414192921e-9],
    [51, 32, 2.44832382029e-9, 2.15016597641e-9],
    [51, 33, -2.60951560956e-9, 1.52467819183e-9],
    [51, 34, -4.45744930366e-9, -8.63806533372e-10],
    [51, 35, 3.69235278447e-9, 2.35190616e-9],
    [51, 36, -6.29900505072e-9, 3.09623528058e-9],
    [51, 37, -2.42400438574e-9, -5.67725678009e-9],
    [51, 38, 1.93754531091e-9, -3.78749955299e-9],
    [51, 39, 5.18352079008e-9, 7.1943364306e-10],
    [51, 40, -3.75486240128e-9, -3.93594099185e-10],
    [51, 41, 1.59750736122e-9, 1.84347565682e-9],
    [51, 42, 1.08532103906e-10, 3.38187726465e-9],
    [51, 43, -4.70417318861e-9, 2.05620529202e-9],
    [51, 44, 5.84039476486e-11, 1.78729403019e-10],
    [51, 45, -9.27158699375e-9, -6.78445566504e-9],
    [51, 46, 4.43259167266e-10, -2.46157692683e-10],
    [51, 47, 3.98850604058e-9, -7.60135354959e-10],
    [51, 48, 3.82558746574e-9, 7.30210650201e-10],
    [51, 49, -1.81638949324e-9, -2.53318816235e-9],
    [51, 50, -1.72644351841e-9, 6.31693515247e-9],
    [51, 51, -5.82872452602e-10, 3.54595341491e-9],
    [52, 0, 8.76798415038e-10, 0],
    [52, 1, -1.38149504612e-9, -5.66141032087e-9],
    [52, 2, 3.4836432635e-9, 5.28635614369e-10],
    [52, 3, 1.04639112365e-9, -1.5228564215e-9],
    [52, 4, 3.56882248468e-9, 1.39421708045e-9],
    [52, 5, -1.63843059269e-10, -1.82640064987e-9],
    [52, 6, -5.63235939456e-9, -9.11110911449e-10],
    [52, 7, -4.13416223316e-9, -1.98030857354e-9],
    [52, 8, 1.08089612653e-9, -1.05065267547e-9],
    [52, 9, -2.25309257496e-9, -4.90274273266e-9],
    [52, 10, 4.91656770818e-10, -2.31790903351e-9],
    [52, 11, 8.49623162948e-10, 8.98170634527e-10],
    [52, 12, -6.91730485478e-10, -3.9659666136e-9],
    [52, 13, -2.80416862125e-9, 4.12310466404e-9],
    [52, 14, 2.97139900464e-9, -8.19405857264e-10],
    [52, 15, 3.06839598366e-9, 1.73170730103e-9],
    [52, 16, 1.07700561094e-9, 2.15016768756e-9],
    [52, 17, 5.61929147521e-10, 8.1048532177e-10],
    [52, 18, 6.75741259998e-11, -1.07335546225e-10],
    [52, 19, -1.73138045774e-10, 2.00872122499e-9],
    [52, 20, 2.51637593884e-9, -2.89273296191e-9],
    [52, 21, 9.37180963914e-10, 7.74653352356e-10],
    [52, 22, -2.89525384544e-9, 3.70971902518e-9],
    [52, 23, 4.80122048791e-9, 1.55755670903e-9],
    [52, 24, -2.08857463529e-10, 3.49443560599e-10],
    [52, 25, 2.73016605838e-9, -1.93509914465e-9],
    [52, 26, -6.189339704e-9, -3.00014001463e-9],
    [52, 27, 1.89914827584e-10, -6.2774489378e-9],
    [52, 28, 2.34014763514e-9, 1.68041304691e-9],
    [52, 29, -6.15123463755e-9, -3.67669689958e-9],
    [52, 30, -1.95803506717e-9, 4.3482414052e-10],
    [52, 31, 2.00437807228e-9, -2.04131283777e-9],
    [52, 32, 4.08993889535e-9, -5.23524692142e-9],
    [52, 33, 7.23079678391e-10, -2.91243158525e-10],
    [52, 34, 5.34859301188e-9, -1.19616795311e-9],
    [52, 35, 7.26948679527e-9, 6.73138495306e-9],
    [52, 36, 1.17843147736e-9, 5.69157012149e-9],
    [52, 37, -9.48668092726e-9, 2.98854532104e-9],
    [52, 38, -1.11739091298e-9, -1.24860923571e-9],
    [52, 39, -1.67662613749e-9, -1.06068350465e-9],
    [52, 40, -1.13236137208e-8, -1.83763617102e-9],
    [52, 41, -2.93883842917e-9, -3.82351912283e-9],
    [52, 42, -7.90417692905e-10, -6.32294388707e-9],
    [52, 43, 5.11631394838e-9, -2.52698911853e-9],
    [52, 44, -1.03301111307e-9, -1.71435313965e-10],
    [52, 45, 2.30203733625e-9, -1.01649106263e-9],
    [52, 46, 3.30713738381e-10, 3.38338658619e-9],
    [52, 47, -3.42160762848e-9, 5.02983249995e-9],
    [52, 48, 2.65608159513e-9, 3.39022454564e-9],
    [52, 49, -7.54977682827e-9, 5.93284589932e-9],
    [52, 50, -4.29943770193e-9, -1.39840789316e-9],
    [52, 51, -5.41323422773e-9, -2.49975427841e-9],
    [52, 52, -3.36745901588e-9, -4.30724346481e-9],
    [53, 0, 7.39414500534e-9, 0],
    [53, 1, -3.04714121131e-10, 8.8215890315e-10],
    [53, 2, 7.28838690522e-9, -6.52238121107e-10],
    [53, 3, -2.12399359799e-9, 2.24066337671e-9],
    [53, 4, 3.58717617839e-9, 7.96897102454e-10],
    [53, 5, -6.80147649549e-11, -3.30758922189e-9],
    [53, 6, 9.44316471102e-10, 5.79133262935e-11],
    [53, 7, 1.3406472307e-9, -5.81577428182e-9],
    [53, 8, 2.10280419261e-9, -2.75802191871e-10],
    [53, 9, 1.42087015325e-9, -2.15146201705e-9],
    [53, 10, 1.11943104826e-8, -4.06468761962e-9],
    [53, 11, 2.14433930045e-9, -4.14953157237e-11],
    [53, 12, -3.71500888101e-10, -5.00637453903e-9],
    [53, 13, 4.10155822309e-9, 2.49015949605e-9],
    [53, 14, 3.31222863068e-9, -1.27009360724e-10],
    [53, 15, 5.72510148935e-9, 4.1725129511e-9],
    [53, 16, -7.52500326838e-10, 6.04404526863e-9],
    [53, 17, -3.73377656741e-9, 1.78687083274e-9],
    [53, 18, 4.02996320836e-9, 2.4657721752e-9],
    [53, 19, 4.0498570533e-9, -1.08755861495e-9],
    [53, 20, -2.21359989072e-9, -1.50377589353e-9],
    [53, 21, -2.2131176844e-9, 2.61974358958e-9],
    [53, 22, 3.09403878851e-10, 5.98902367107e-9],
    [53, 23, 3.97356356698e-9, -4.70495102021e-9],
    [53, 24, -5.76088117962e-9, 5.75114156525e-9],
    [53, 25, 6.11403651036e-10, -6.50681640058e-9],
    [53, 26, -1.66751531536e-9, 2.71923696222e-9],
    [53, 27, 3.18331377085e-10, -3.16805881777e-9],
    [53, 28, 9.65637477157e-10, 3.28935502086e-9],
    [53, 29, -6.85396185457e-9, -1.68422797685e-9],
    [53, 30, -5.25371139751e-9, -6.32579167986e-9],
    [53, 31, -3.12617962003e-9, 2.64208621023e-9],
    [53, 32, 2.64522150816e-9, -1.79270110503e-9],
    [53, 33, -9.82876370374e-10, 2.67682650237e-9],
    [53, 34, -4.99020528324e-9, -7.47799760824e-9],
    [53, 35, 1.27630262449e-9, -3.82799570433e-9],
    [53, 36, 3.34864016333e-9, 2.4776692672e-9],
    [53, 37, -2.36880526065e-9, 6.84918482541e-10],
    [53, 38, 1.81251969469e-9, -2.58686721606e-9],
    [53, 39, -2.2299243907e-9, -2.22626260082e-9],
    [53, 40, -3.53715648948e-10, -1.17670852432e-9],
    [53, 41, 7.3844499114e-9, -6.5016347931e-9],
    [53, 42, 5.05700211397e-9, 2.70769985181e-9],
    [53, 43, -8.69327874384e-10, 4.47494835684e-9],
    [53, 44, 1.88549992134e-9, -1.92998657957e-10],
    [53, 45, -7.17045019834e-9, 2.66972378251e-9],
    [53, 46, -1.88345296316e-10, -5.39599318434e-9],
    [53, 47, -5.39807588885e-10, 5.57888382466e-9],
    [53, 48, -3.23947926918e-9, -3.23766274929e-9],
    [53, 49, -1.19368777918e-9, -3.85656430328e-9],
    [53, 50, 8.23580014839e-9, 1.6439821637e-9],
    [53, 51, 2.66743822325e-9, 6.24216504149e-10],
    [53, 52, 5.9453716685e-9, 7.88573350628e-11],
    [53, 53, 3.06538339589e-9, 5.3341969402e-9],
    [54, 0, 2.34445433733e-9, 0],
    [54, 1, -1.63325750131e-9, 2.72579797239e-9],
    [54, 2, 6.21065924844e-10, -1.53344334067e-9],
    [54, 3, 6.17655726607e-9, 1.72231850265e-9],
    [54, 4, -1.53756024938e-9, -5.38503215163e-9],
    [54, 5, 1.71025148024e-9, -2.10045694038e-9],
    [54, 6, 2.71712290141e-9, -4.00601085224e-9],
    [54, 7, 2.49375278882e-9, 1.66739205495e-9],
    [54, 8, 3.09536123212e-9, -2.20912248616e-9],
    [54, 9, 3.9454479358e-9, 7.97083290065e-9],
    [54, 10, 1.75731695302e-9, -1.1132382592e-9],
    [54, 11, 4.87117619523e-9, 7.52762912362e-10],
    [54, 12, -6.63046613101e-10, -1.93330478441e-9],
    [54, 13, 3.67538937609e-9, 3.80757774933e-10],
    [54, 14, -3.49951073582e-9, 1.0565160883e-9],
    [54, 15, 3.56355689655e-9, -3.87379098933e-9],
    [54, 16, -2.63366819981e-9, 1.42492006524e-9],
    [54, 17, -8.33782483479e-10, 5.59438560117e-9],
    [54, 18, 2.2919525377e-9, -1.08492585917e-9],
    [54, 19, 8.14671390685e-9, -1.25445329655e-9],
    [54, 20, -2.00947462688e-9, -5.07703414709e-10],
    [54, 21, -3.55057635353e-9, 2.33962811701e-9],
    [54, 22, -2.41081442258e-9, 3.47823958258e-9],
    [54, 23, 2.71765348294e-10, -1.67141963556e-9],
    [54, 24, 2.64677470591e-9, 4.41949360703e-9],
    [54, 25, -3.32077069935e-9, -2.97584290355e-9],
    [54, 26, 4.16470815837e-9, -2.16171935118e-9],
    [54, 27, -8.85142158375e-11, 5.13309529866e-9],
    [54, 28, -1.59440736943e-9, -8.2197642849e-10],
    [54, 29, -2.5924626518e-9, 1.48856515604e-9],
    [54, 30, 2.0498752606e-9, 1.47028551165e-9],
    [54, 31, 4.72639113262e-11, 4.4006947227e-9],
    [54, 32, -2.0335622875e-9, 1.76053276479e-9],
    [54, 33, -5.89151694068e-9, 9.87055800376e-10],
    [54, 34, -8.25136356724e-9, -3.75714117336e-9],
    [54, 35, 6.09892821968e-10, -8.38514526043e-9],
    [54, 36, 2.15656594032e-9, -6.44497084335e-9],
    [54, 37, 2.0605327412e-9, 1.76198487716e-9],
    [54, 38, -5.48211323718e-10, -7.91954907407e-10],
    [54, 39, 7.94629016052e-9, -1.78556545348e-9],
    [54, 40, 2.56945921061e-9, 7.09146429051e-10],
    [54, 41, 5.99241321284e-9, 3.5382152859e-9],
    [54, 42, 6.09090280984e-9, 6.24258654012e-9],
    [54, 43, -2.00658210931e-9, 3.84550094672e-9],
    [54, 44, -2.27399790479e-9, 3.69030540504e-9],
    [54, 45, -1.72329669734e-9, -5.59133662137e-9],
    [54, 46, 1.35943570556e-9, -4.55557936708e-9],
    [54, 47, -2.28466276628e-9, 3.05954138516e-9],
    [54, 48, 3.70267003252e-9, 1.73978075968e-9],
    [54, 49, -1.17939203022e-10, 3.69808287361e-10],
    [54, 50, -1.93513576999e-9, -7.5730375747e-10],
    [54, 51, 4.81956704621e-9, 3.7844372781e-9],
    [54, 52, 1.50120526365e-9, -2.15128841698e-9],
    [54, 53, -4.12854244119e-9, 2.98108912543e-9],
    [54, 54, -7.55485762212e-9, 5.65281315607e-9],
    [55, 0, 1.11500556632e-9, 0],
    [55, 1, -1.60872597407e-9, 5.06314867009e-9],
    [55, 2, -2.07675413854e-9, -2.0293274499e-9],
    [55, 3, 4.78360486889e-9, 3.16338271835e-9],
    [55, 4, -2.80572537025e-10, 1.74272743901e-9],
    [55, 5, 6.41513424294e-9, 4.32492098613e-9],
    [55, 6, -3.01434563476e-9, -1.83270290375e-9],
    [55, 7, 2.07489314991e-9, 3.43334353979e-9],
    [55, 8, -3.7520728304e-9, 3.92255136258e-10],
    [55, 9, 2.75263092641e-9, 2.04139708981e-9],
    [55, 10, -3.21784480116e-10, 3.79120101535e-9],
    [55, 11, 1.95737046947e-9, 2.68965956784e-9],
    [55, 12, 1.19490109098e-9, 3.82865321011e-9],
    [55, 13, 1.25350979551e-9, -5.99559166554e-10],
    [55, 14, -9.45489519281e-10, 6.67858672733e-10],
    [55, 15, -1.86643859266e-9, -5.2827910694e-9],
    [55, 16, -4.14012310247e-9, 1.18191255826e-11],
    [55, 17, -1.67262783538e-9, -4.20372330524e-10],
    [55, 18, -1.17378265358e-9, 7.18757033512e-9],
    [55, 19, 1.15880262798e-9, -4.88672190986e-10],
    [55, 20, -1.09134081955e-9, 1.12852704124e-9],
    [55, 21, 7.63011490955e-10, -3.07131265813e-9],
    [55, 22, 3.67528505661e-9, -2.2170875874e-9],
    [55, 23, 1.72904178175e-9, 5.65769224107e-9],
    [55, 24, 6.47552695616e-9, 4.04132843393e-9],
    [55, 25, -4.80503497105e-9, 1.148635688e-9],
    [55, 26, -9.15506578401e-10, -1.57512079402e-9],
    [55, 27, -4.09805539164e-9, 3.58860394496e-9],
    [55, 28, 7.32641207577e-10, 1.6884711712e-10],
    [55, 29, 2.34535030056e-9, -5.81713354439e-10],
    [55, 30, 4.86390626966e-9, -5.45654234076e-10],
    [55, 31, -6.94349724743e-11, 1.45812620579e-9],
    [55, 32, -5.40225256568e-10, 1.27646466703e-9],
    [55, 33, 2.43334203217e-9, -5.02404069993e-10],
    [55, 34, -1.98951749851e-9, 1.01116253467e-9],
    [55, 35, 2.85139793612e-9, -3.05282697978e-9],
    [55, 36, 1.91380314399e-9, 4.98852051077e-9],
    [55, 37, -3.15219070359e-9, 5.93331277835e-9],
    [55, 38, -7.56041746326e-9, 9.84901693652e-10],
    [55, 39, -1.06689496608e-9, -4.3748204846e-9],
    [55, 40, 2.03535952813e-9, -4.66387996652e-9],
    [55, 41, 3.93834082651e-9, -2.19387599178e-10],
    [55, 42, 2.75834297118e-9, -2.79628803078e-9],
    [55, 43, 9.07957899493e-10, 8.40868060464e-10],
    [55, 44, 8.00817837274e-9, -2.4147812832e-9],
    [55, 45, 1.18785037967e-9, 4.26953178683e-9],
    [55, 46, -3.06732675697e-9, -2.15810894136e-9],
    [55, 47, 3.41200900365e-9, 3.41423275214e-10],
    [55, 48, -4.78930228198e-9, -2.05983243604e-9],
    [55, 49, 2.79038478352e-9, -1.88984039871e-9],
    [55, 50, -3.41046654256e-9, 8.86594689152e-10],
    [55, 51, -3.23203516496e-10, 4.71644852681e-9],
    [55, 52, -4.05016326974e-9, -3.01198652842e-9],
    [55, 53, 7.26972758344e-10, 2.07297807512e-9],
    [55, 54, -5.60482631431e-9, -5.70982039368e-9],
    [55, 55, 2.0912126542e-9, -7.07073270661e-9],
    [56, 0, -4.72339389186e-9, 0],
    [56, 1, 3.93187516478e-9, 3.37742314575e-9],
    [56, 2, -4.91199959679e-9, 4.84133406549e-9],
    [56, 3, -1.12307325e-9, 1.54654210299e-9],
    [56, 4, -1.90960361942e-9, 6.0662196543e-9],
    [56, 5, 2.39124727679e-9, 7.24440138913e-10],
    [56, 6, -7.97825586227e-9, 7.30944564463e-10],
    [56, 7, 2.12416853387e-9, -8.57976125108e-10],
    [56, 8, -4.72264552586e-9, -3.62688140057e-9],
    [56, 9, 4.17406631345e-9, 8.89209706279e-10],
    [56, 10, -4.4161564875e-9, 1.22951687667e-9],
    [56, 11, 2.9856756475e-10, 3.11918333619e-9],
    [56, 12, 4.22220007761e-10, 4.13537925932e-9],
    [56, 13, 3.63075203614e-10, 5.57427443402e-9],
    [56, 14, -1.20038874868e-9, 3.59461966057e-9],
    [56, 15, -2.43193187397e-9, 1.50784402128e-9],
    [56, 16, 1.76375553852e-9, -3.48352623489e-9],
    [56, 17, -8.27228754412e-9, -2.45109719712e-10],
    [56, 18, -2.96687367692e-9, 3.3502264984e-9],
    [56, 19, -1.4569590902e-9, 7.52664839174e-10],
    [56, 20, 4.95674336378e-9, -1.24093608223e-9],
    [56, 21, 4.34010132857e-10, -3.62599395105e-9],
    [56, 22, 1.02903480851e-9, 3.66768421992e-10],
    [56, 23, 2.18140248955e-9, 4.02218260274e-9],
    [56, 24, 1.48670018695e-9, -2.34022367466e-10],
    [56, 25, -2.02983225226e-9, 2.662861669e-9],
    [56, 26, 2.35098396283e-9, -4.80905595577e-9],
    [56, 27, 7.69884673858e-10, 3.6589760993e-9],
    [56, 28, -3.47706836778e-9, 1.21392534223e-9],
    [56, 29, 4.58476012609e-9, -3.30989008906e-9],
    [56, 30, -8.90571422954e-10, 1.91903209074e-9],
    [56, 31, 6.23190857099e-11, -6.00634153014e-9],
    [56, 32, 3.36744529472e-9, -2.46952130176e-9],
    [56, 33, 6.00258596104e-9, 1.83850057556e-9],
    [56, 34, 2.38699258827e-9, 1.05704445326e-9],
    [56, 35, -1.2650662423e-9, 2.04344608836e-10],
    [56, 36, 3.3648761478e-9, -1.76634400966e-9],
    [56, 37, 2.65007318281e-9, 5.47726339379e-9],
    [56, 38, 1.34152886307e-9, 4.30628684803e-9],
    [56, 39, -1.11997228481e-9, -3.74794567494e-9],
    [56, 40, 2.60773503449e-9, 3.84145713821e-9],
    [56, 41, -8.41413420568e-10, 2.38307078957e-9],
    [56, 42, -4.57278944483e-9, -1.67354031195e-10],
    [56, 43, -7.0867933999e-10, -4.64484669076e-9],
    [56, 44, 1.46770567139e-9, 2.33734816689e-9],
    [56, 45, 4.3603629917e-9, -7.66352488156e-10],
    [56, 46, 3.83046528394e-9, -4.64542462872e-9],
    [56, 47, 7.60128547162e-9, 2.63665894884e-9],
    [56, 48, -1.93561135253e-9, -3.14425423758e-9],
    [56, 49, 5.13841446824e-9, 6.12618507594e-9],
    [56, 50, -4.24203285154e-9, 1.10142149502e-9],
    [56, 51, 2.60851617544e-9, -1.11959453734e-9],
    [56, 52, -3.97720336952e-9, -2.0036996774e-9],
    [56, 53, -9.47121716778e-9, -3.55057178782e-10],
    [56, 54, -6.94814016529e-9, -1.69137671201e-9],
    [56, 55, 7.98865468552e-11, -3.1173521588e-9],
    [56, 56, 1.47399949068e-9, -1.45242215051e-9],
    [57, 0, -3.21170195605e-9, 0],
    [57, 1, 3.21316836111e-9, -2.88667726745e-9],
    [57, 2, -2.69363244343e-9, 1.89537069823e-9],
    [57, 3, -5.68390427578e-9, 3.99187444828e-9],
    [57, 4, -7.60632653945e-9, -1.49323176287e-9],
    [57, 5, -3.24700065576e-9, 1.15421916053e-9],
    [57, 6, 6.61702166546e-11, -3.38009595419e-10],
    [57, 7, -4.48989081521e-10, -3.99713445387e-10],
    [57, 8, 4.46417839566e-9, 9.96642939907e-9],
    [57, 9, 4.99167409253e-10, -4.98881717263e-9],
    [57, 10, -1.3852416459e-9, 3.44921406019e-9],
    [57, 11, -5.19522955267e-9, -7.54439426466e-9],
    [57, 12, 4.37374747378e-9, 5.79072594074e-9],
    [57, 13, 1.44772887449e-9, -1.98649438294e-9],
    [57, 14, -5.77964835255e-10, 6.27215648109e-9],
    [57, 15, 3.94955380257e-10, 3.67834142727e-9],
    [57, 16, -8.95734559548e-10, -4.28575969194e-9],
    [57, 17, -1.12217369185e-9, -2.15050942731e-10],
    [57, 18, 1.48732682437e-9, 3.74728890857e-11],
    [57, 19, -4.27202539236e-9, 4.14527968236e-9],
    [57, 20, 2.97692629891e-9, 2.17910165146e-9],
    [57, 21, -2.85791328884e-10, 1.29265392075e-10],
    [57, 22, 2.72556998882e-9, 1.25406361653e-10],
    [57, 23, -2.72373503201e-9, -4.70603169853e-10],
    [57, 24, -1.72321207592e-9, -2.49534066392e-9],
    [57, 25, 6.9246298552e-9, -2.15145597759e-9],
    [57, 26, -2.11476949688e-9, -4.8633974229e-9],
    [57, 27, 6.70002950588e-10, 7.02037588492e-10],
    [57, 28, -3.93997936578e-9, -4.81797938235e-10],
    [57, 29, 3.08242394642e-10, -2.08250614945e-9],
    [57, 30, 6.38671671001e-9, 3.02153834789e-9],
    [57, 31, -7.82870397906e-10, -2.6008882452e-9],
    [57, 32, 3.15570240884e-10, -1.37701877645e-9],
    [57, 33, 1.01302715301e-9, 3.32687130304e-9],
    [57, 34, -2.37378898142e-9, 1.66067712161e-9],
    [57, 35, -3.87135453191e-10, -3.90074040579e-9],
    [57, 36, -7.76337112424e-10, -6.19562839282e-9],
    [57, 37, 2.35898417363e-9, 2.88691601848e-9],
    [57, 38, 4.71900941691e-9, 3.88845627051e-9],
    [57, 39, 1.9577126687e-9, 1.39326869442e-10],
    [57, 40, 1.63204331066e-9, 7.61024587558e-10],
    [57, 41, -1.23608606742e-9, 1.48398991073e-9],
    [57, 42, -8.01739032031e-9, 1.65925084437e-9],
    [57, 43, -1.9472118231e-9, -6.96223907704e-9],
    [57, 44, 1.48545488699e-9, 6.0847510663e-10],
    [57, 45, -1.28048424926e-9, 3.9397941201e-9],
    [57, 46, -4.36866174492e-9, 2.62332157302e-9],
    [57, 47, 5.46502666692e-10, -1.49261021303e-9],
    [57, 48, -1.22176218276e-9, 4.76252215549e-9],
    [57, 49, 5.9421017778e-10, -2.95814148934e-9],
    [57, 50, -1.26176074296e-9, -4.07107776326e-9],
    [57, 51, -2.89691401244e-9, -3.54285578396e-9],
    [57, 52, 2.82291628743e-9, -5.93637790965e-10],
    [57, 53, 3.26879105716e-9, -1.86559579312e-9],
    [57, 54, -6.21522105116e-9, 2.85042203396e-9],
    [57, 55, 2.69124869207e-9, 8.78840270571e-10],
    [57, 56, 8.17472289691e-10, 2.43710618039e-9],
    [57, 57, -2.8798869729e-9, -3.27463131606e-9],
    [58, 0, -3.04026167193e-9, 0],
    [58, 1, -1.08478222238e-9, -1.32928017843e-9],
    [58, 2, 9.23188476856e-10, 4.80603297668e-9],
    [58, 3, -2.06649260359e-9, -6.95744636399e-9],
    [58, 4, -3.27865597852e-9, 5.32278571511e-11],
    [58, 5, 2.12675298762e-9, -2.92812252454e-9],
    [58, 6, 8.33902828255e-10, 5.51974543542e-10],
    [58, 7, -6.67899299463e-9, 2.59007304356e-9],
    [58, 8, 3.29236954324e-9, 5.33880910177e-9],
    [58, 9, -4.61158209822e-9, -6.27355092632e-9],
    [58, 10, 2.9132704923e-10, -2.26859359435e-9],
    [58, 11, -2.61942590593e-9, -4.47355541188e-9],
    [58, 12, 1.78221947371e-9, -4.7735401558e-10],
    [58, 13, -3.96530233357e-9, -1.32965315696e-9],
    [58, 14, 3.48940083326e-9, -2.68100081998e-9],
    [58, 15, 1.16488140214e-9, 8.90751460346e-10],
    [58, 16, 2.57363716205e-9, -3.19905406084e-9],
    [58, 17, 4.02538157319e-9, 1.85694240803e-9],
    [58, 18, 2.82093688921e-9, -1.06405390043e-9],
    [58, 19, 1.7012607163e-9, -3.34731919564e-10],
    [58, 20, -2.51187789653e-9, 1.42719074798e-9],
    [58, 21, -9.58199433933e-10, 4.67151219042e-9],
    [58, 22, 3.58477651027e-9, -3.01829681057e-9],
    [58, 23, -2.31450839572e-10, 1.93661530796e-9],
    [58, 24, -3.78325445015e-9, -1.69872441251e-9],
    [58, 25, 2.56044797918e-9, -2.54378658689e-9],
    [58, 26, -1.27782193538e-9, 1.73767371058e-10],
    [58, 27, -3.23354377687e-9, -5.04501281974e-9],
    [58, 28, -2.59227169682e-9, -2.36734585774e-9],
    [58, 29, 2.97554666907e-9, -2.85652687635e-9],
    [58, 30, 6.04569531877e-9, 3.75516024362e-9],
    [58, 31, -3.43248065391e-9, 1.46238074061e-9],
    [58, 32, 2.37476582107e-9, 1.45244777155e-9],
    [58, 33, -7.52607182802e-10, 1.05308043232e-9],
    [58, 34, -8.65323753819e-10, 2.04104334763e-9],
    [58, 35, -2.77001345849e-9, -5.52538116119e-10],
    [58, 36, -3.32562035783e-9, -2.15376532524e-9],
    [58, 37, 3.12471423796e-9, -3.01068285636e-9],
    [58, 38, -5.36442273703e-9, 2.08224214773e-9],
    [58, 39, 6.47653277498e-10, -1.42910140132e-9],
    [58, 40, 1.50460554912e-9, -4.24935039663e-9],
    [58, 41, 1.15092601553e-9, 3.32051250227e-9],
    [58, 42, 9.60297889844e-10, -2.27838795598e-9],
    [58, 43, -5.41112669807e-10, -2.35418031119e-9],
    [58, 44, 6.15805210195e-9, 1.87828424448e-10],
    [58, 45, -5.20846410811e-10, 4.70659085081e-9],
    [58, 46, 1.21774908189e-9, 2.29075575035e-9],
    [58, 47, 6.2757629345e-10, 1.42648810667e-12],
    [58, 48, -1.66101437469e-9, -3.67587707399e-9],
    [58, 49, 1.86732868852e-9, -5.66898467398e-10],
    [58, 50, -7.42645959521e-11, 6.85663459878e-9],
    [58, 51, 1.14891050865e-9, -2.25897684441e-9],
    [58, 52, -4.82025203156e-10, 5.29942225131e-9],
    [58, 53, -4.87462818405e-9, -2.49783280379e-9],
    [58, 54, -2.51333548471e-9, -6.16985109964e-10],
    [58, 55, 7.59018979346e-10, -3.0925586192e-9],
    [58, 56, -1.10867227254e-9, -1.66085135977e-10],
    [58, 57, -2.28410674649e-9, -5.04239243654e-11],
    [58, 58, -5.64538331798e-11, 4.01348376492e-10],
    [59, 0, 1.84005018738e-9, 0],
    [59, 1, -4.30730603856e-9, -2.16359686553e-9],
    [59, 2, 5.95774155105e-9, 1.0325005577e-9],
    [59, 3, -2.7942573153e-9, -5.47527651961e-9],
    [59, 4, 3.42609272674e-9, 2.16523988709e-9],
    [59, 5, -6.12026756307e-10, -2.62667061889e-9],
    [59, 6, -5.72183306744e-9, -6.18209980288e-10],
    [59, 7, -3.16077742158e-9, 1.45699524002e-9],
    [59, 8, 3.90720086374e-9, 1.31751660683e-10],
    [59, 9, -1.94638915066e-9, -4.2437640733e-10],
    [59, 10, 5.38522927253e-9, -5.23977027157e-9],
    [59, 11, 3.71827948125e-10, 1.19995874003e-9],
    [59, 12, 2.52165719682e-9, -3.72136186831e-9],
    [59, 13, -4.89966078375e-9, -7.49361004805e-10],
    [59, 14, 4.44396886733e-10, -5.79434523422e-9],
    [59, 15, 6.51777807787e-12, -3.70360709563e-9],
    [59, 16, -2.36862263524e-9, -6.79732453768e-10],
    [59, 17, 2.94401448351e-9, 5.16256822799e-12],
    [59, 18, 3.56280802208e-9, 2.5662982814e-10],
    [59, 19, -2.25211043514e-10, -3.64892538339e-9],
    [59, 20, -4.06561794516e-9, -1.46977612614e-9],
    [59, 21, 4.37576687887e-9, 1.44078004641e-10],
    [59, 22, 1.07081104606e-9, -3.60055970698e-9],
    [59, 23, 4.55862213443e-9, 3.44192591105e-9],
    [59, 24, 5.46932841364e-10, -4.21932442293e-10],
    [59, 25, 1.27842334291e-9, -1.93946585452e-9],
    [59, 26, 7.30577396232e-10, 9.86497764193e-9],
    [59, 27, -2.20629326241e-9, -1.47362403917e-9],
    [59, 28, 6.43123404123e-10, -1.9623232343e-10],
    [59, 29, -3.71544563337e-9, -1.22550888905e-9],
    [59, 30, -2.68565202994e-9, -1.24940890701e-9],
    [59, 31, -2.07613642361e-9, 4.00778058367e-9],
    [59, 32, 1.21731266443e-9, -1.50178902545e-10],
    [59, 33, -7.84371886852e-10, -5.68998710094e-10],
    [59, 34, 2.43208998238e-9, 1.36247407312e-10],
    [59, 35, -1.4181774736e-9, -6.53346491469e-10],
    [59, 36, 2.02347644318e-10, 8.31447453024e-10],
    [59, 37, -9.23895659751e-10, -2.34310018371e-9],
    [59, 38, -1.39281956666e-9, 4.6506463506e-9],
    [59, 39, -1.94835135401e-9, 1.03150695653e-9],
    [59, 40, -8.43612810676e-9, 1.67520306335e-9],
    [59, 41, -1.74413081545e-9, 1.61990099703e-9],
    [59, 42, -2.23434078315e-9, -1.9197190837e-9],
    [59, 43, -2.5297036296e-9, -2.47765221813e-9],
    [59, 44, 5.71900132781e-9, -3.48662561791e-9],
    [59, 45, 6.61643059435e-9, -1.67206511864e-9],
    [59, 46, 4.70987199525e-9, 1.54226897685e-9],
    [59, 47, -1.95302174379e-10, 5.48211295739e-9],
    [59, 48, 3.01958964219e-9, 6.14997097285e-9],
    [59, 49, -2.06991305996e-9, 3.40548763489e-9],
    [59, 50, -4.11924401562e-9, 2.6593773179e-9],
    [59, 51, -3.83283085075e-10, -4.99876420993e-10],
    [59, 52, -5.94199746286e-9, -8.61782585181e-10],
    [59, 53, -3.87109442684e-10, -3.44263672292e-9],
    [59, 54, -2.95940307214e-9, -2.23449633871e-9],
    [59, 55, -6.95084157022e-10, 1.92258240027e-9],
    [59, 56, 3.65564741882e-9, -2.51518218787e-9],
    [59, 57, 3.44982010469e-9, -2.31599725831e-9],
    [59, 58, 8.16880688302e-10, -2.4374373583e-9],
    [59, 59, 2.50955492584e-9, 6.95639719744e-10],
    [60, 0, -4.37107330818e-10, 0],
    [60, 1, 1.35037939308e-9, 2.27325905103e-10],
    [60, 2, 3.54148990661e-9, -2.09618034496e-9],
    [60, 3, 2.94252688874e-9, 2.82304181314e-11],
    [60, 4, 7.13911472626e-9, 5.42786835988e-12],
    [60, 5, -2.14648651625e-9, -5.0840220659e-10],
    [60, 6, -4.31103089415e-9, -2.9507366025e-9],
    [60, 7, -1.85258364164e-9, -2.53159133173e-9],
    [60, 8, 2.57762138479e-9, -1.12968653689e-9],
    [60, 9, 6.22513383718e-10, 2.1529742175e-9],
    [60, 10, 4.35474215331e-10, -2.63640978613e-9],
    [60, 11, 2.65279568549e-9, 4.26794283564e-9],
    [60, 12, 9.19528355618e-10, -3.15789781771e-9],
    [60, 13, -5.14191599279e-10, -7.46402264962e-10],
    [60, 14, -2.47185393426e-9, -1.37176619352e-9],
    [60, 15, 1.09604770699e-9, 1.31271073866e-10],
    [60, 16, -3.3491119957e-9, -8.90593127112e-10],
    [60, 17, -4.96588408804e-9, 1.63819818821e-9],
    [60, 18, -2.31564319275e-9, -2.65425713522e-9],
    [60, 19, 3.58477719971e-9, -2.11652530221e-9],
    [60, 20, -9.65281468037e-10, 4.71648908653e-11],
    [60, 21, 1.13735842658e-9, -4.65494517033e-9],
    [60, 22, 3.19231598114e-9, 3.8218991247e-9],
    [60, 23, 6.47045604201e-9, -2.6683837737e-9],
    [60, 24, -1.91270019584e-9, 1.20485640133e-9],
    [60, 25, 1.41091285156e-9, 5.69978420103e-10],
    [60, 26, 3.69920738748e-9, 4.03654982377e-9],
    [60, 27, -4.33668934222e-9, 2.00533142094e-9],
    [60, 28, 1.40330308999e-9, -1.51901856059e-9],
    [60, 29, 2.05208494076e-9, 2.93958904408e-9],
    [60, 30, -4.41072085568e-9, -2.59255339113e-9],
    [60, 31, 3.95452765995e-9, 4.67851945535e-10],
    [60, 32, -6.53222531186e-10, -3.15564592724e-10],
    [60, 33, -4.72827010055e-9, 4.0228503116e-9],
    [60, 34, 4.59026806936e-9, -2.36928246359e-9],
    [60, 35, 1.42971814932e-9, 5.61852956581e-10],
    [60, 36, 8.71633328024e-10, -4.91677668181e-11],
    [60, 37, -2.90019034808e-9, 7.12651714058e-10],
    [60, 38, 1.31594119427e-9, -1.32657347622e-11],
    [60, 39, -2.24306948157e-9, -5.36564726301e-9],
    [60, 40, -6.00658998713e-10, 9.5446989847e-10],
    [60, 41, -7.89338924393e-10, -1.04686250574e-9],
    [60, 42, 1.71092096933e-9, 3.10437318149e-9],
    [60, 43, 4.43542188328e-9, 7.96344058695e-10],
    [60, 44, 1.43059991847e-9, -8.08503442174e-10],
    [60, 45, 4.13939240764e-9, -3.91776207592e-9],
    [60, 46, 1.18713985523e-9, 3.48857058951e-10],
    [60, 47, 7.79446801294e-10, 1.97923464992e-9],
    [60, 48, -4.479064558e-9, -3.72644360805e-9],
    [60, 49, 5.94065668151e-9, -4.46389160256e-9],
    [60, 50, 3.56705231468e-9, 3.84698960264e-9],
    [60, 51, -2.95789519005e-9, -5.80274740616e-10],
    [60, 52, 3.33304351432e-9, 5.36871064211e-9],
    [60, 53, -8.90121478107e-10, 5.68046802894e-9],
    [60, 54, 4.75133911772e-9, -2.71008321877e-9],
    [60, 55, 2.38809469672e-9, 2.89374229409e-9],
    [60, 56, -1.45525193506e-9, -3.54195525281e-9],
    [60, 57, -1.74421953297e-9, -3.22491239477e-10],
    [60, 58, -1.4408546551e-9, 2.3162527247e-9],
    [60, 59, -2.32041311232e-9, 1.20585444605e-9],
    [60, 60, 4.23068069789e-9, 3.92983780545e-10],
    [61, 0, 2.91887463429e-9, 0],
    [61, 1, 1.27100640554e-9, 1.1527802968e-9],
    [61, 2, 1.46481071771e-10, -1.45575130609e-9],
    [61, 3, -3.68191723212e-10, 5.88826753023e-9],
    [61, 4, 1.8759263652e-10, -2.32339117817e-9],
    [61, 5, 5.66311223183e-10, -6.80700970491e-11],
    [61, 6, 3.82420801812e-9, -2.25351133926e-9],
    [61, 7, 6.60129802478e-10, 1.24419034443e-9],
    [61, 8, 1.65261866822e-9, -7.3219117806e-10],
    [61, 9, 2.31920165264e-9, 4.09650329931e-9],
    [61, 10, -4.98575740811e-11, 1.1526211454e-9],
    [61, 11, 2.14406016667e-9, 3.75488837062e-9],
    [61, 12, -7.95905785958e-10, -1.46438312123e-9],
    [61, 13, 4.28581019782e-9, -1.47641757488e-9],
    [61, 14, -1.1402053676e-9, 1.13045597617e-9],
    [61, 15, 2.25602914427e-9, -1.33254977828e-9],
    [61, 16, -2.61306665773e-9, -3.27265930812e-10],
    [61, 17, -1.11154836346e-9, 1.54668158602e-9],
    [61, 18, -3.84844407383e-9, -3.71574325194e-9],
    [61, 19, 1.14729122988e-9, 1.86094245281e-9],
    [61, 20, 3.58697501171e-9, 1.22711361558e-9],
    [61, 21, -3.30713394959e-9, 2.95584825461e-9],
    [61, 22, 1.61709639793e-9, 2.28492854556e-9],
    [61, 23, -5.37091465296e-9, -7.24986447496e-10],
    [61, 24, 3.8743101467e-9, 3.47911082821e-9],
    [61, 25, 7.39109788472e-10, -2.45196023626e-9],
    [61, 26, 1.04840831653e-9, -4.43478517383e-9],
    [61, 27, -1.55773079848e-10, 7.96767958532e-10],
    [61, 28, 6.10151064993e-9, -1.94880328424e-9],
    [61, 29, -9.31170259035e-10, 2.76205645541e-9],
    [61, 30, -8.53996273305e-11, 1.0091217904e-9],
    [61, 31, 2.82556619158e-9, 2.55162418629e-10],
    [61, 32, -7.13300947942e-11, 5.34962387181e-9],
    [61, 33, -3.34181483128e-9, -2.52817172663e-13],
    [61, 34, 1.53688926359e-9, -2.66572762194e-9],
    [61, 35, -2.27754986539e-9, 1.84788936469e-9],
    [61, 36, -1.38831515254e-9, 1.43770460288e-9],
    [61, 37, -3.78606444153e-9, -1.18351157417e-9],
    [61, 38, -4.38270549644e-10, -7.02424824444e-9],
    [61, 39, 3.41992301732e-9, -2.84531817267e-9],
    [61, 40, 3.57186601972e-9, -2.63385467123e-9],
    [61, 41, -2.69438012199e-10, -3.29472468104e-9],
    [61, 42, 3.89064894105e-9, 3.17710263497e-9],
    [61, 43, 2.74882592267e-9, 4.36628365878e-9],
    [61, 44, 8.97736938972e-10, 5.29923435682e-9],
    [61, 45, 2.08983766357e-9, 2.48661289187e-9],
    [61, 46, -7.72928757681e-10, 1.74006708418e-9],
    [61, 47, -4.25987363821e-10, 3.77167302466e-9],
    [61, 48, 1.50264740771e-10, 2.48850110599e-10],
    [61, 49, 1.17185140367e-9, -1.05779456409e-9],
    [61, 50, -1.35609966818e-9, 2.8200215902e-9],
    [61, 51, -3.86623269653e-10, 2.40839662032e-9],
    [61, 52, -4.21687251964e-9, -1.1363410179e-9],
    [61, 53, -2.45536806531e-9, -4.4665590786e-9],
    [61, 54, 2.88866558053e-9, 4.90645309938e-10],
    [61, 55, 5.34543115729e-10, -1.30335923758e-9],
    [61, 56, 3.27747235568e-9, 2.99329733172e-9],
    [61, 57, 5.13363616131e-9, 3.1868386279e-9],
    [61, 58, -1.99497016106e-9, 6.40896831887e-9],
    [61, 59, -4.40785716237e-9, -2.11143899502e-9],
    [61, 60, -2.83484430391e-9, -3.23756290223e-9],
    [61, 61, -1.62902793279e-9, 8.57870721552e-10],
    [62, 0, 2.6020748123e-9, 0],
    [62, 1, 1.16017629665e-9, 3.37733908336e-9],
    [62, 2, -5.01970222671e-9, 4.84997931443e-9],
    [62, 3, 5.51834864324e-9, 1.51730880202e-9],
    [62, 4, -3.16971201208e-9, -3.18759682781e-10],
    [62, 5, 3.75210299244e-9, 1.72747428774e-9],
    [62, 6, 1.758796205e-9, -5.99162691156e-9],
    [62, 7, -1.84017411521e-9, 2.39854854243e-9],
    [62, 8, 5.93805348645e-10, 1.46920502501e-9],
    [62, 9, 2.63026066055e-9, -1.59005126125e-9],
    [62, 10, -1.86264804107e-9, 5.71819426307e-9],
    [62, 11, 1.59410801301e-9, 2.45364835475e-9],
    [62, 12, 3.77058963932e-9, 3.12148130027e-10],
    [62, 13, 3.25613324726e-9, -2.96045940208e-9],
    [62, 14, 1.91133253419e-9, 7.36632375917e-9],
    [62, 15, -1.48003576869e-9, -3.9576199058e-11],
    [62, 16, 2.0836018328e-9, -3.19414110768e-10],
    [62, 17, -1.23513343836e-10, -2.29274795014e-9],
    [62, 18, -3.65408431933e-10, 6.49530111016e-10],
    [62, 19, 2.10667182582e-9, 6.20977993584e-10],
    [62, 20, 2.66783108091e-9, 3.55242602025e-9],
    [62, 21, -2.17727237689e-9, 1.53900421823e-10],
    [62, 22, 1.65181871911e-10, -1.15377345316e-9],
    [62, 23, -3.56900495656e-9, -1.22778901526e-9],
    [62, 24, 4.1671919004e-9, 1.02075915808e-9],
    [62, 25, -2.07765023478e-9, -6.13622564554e-10],
    [62, 26, -2.24856322953e-9, -2.13075979834e-10],
    [62, 27, 5.34667998788e-10, 2.1549958035e-9],
    [62, 28, 8.28523980308e-10, -9.55817031537e-10],
    [62, 29, 1.24438608514e-9, 3.56026512891e-9],
    [62, 30, -4.72678574359e-9, -1.64089488542e-9],
    [62, 31, -2.50140516558e-10, -3.40327894339e-9],
    [62, 32, 5.8659536881e-10, 6.04913535906e-9],
    [62, 33, -3.35518053404e-9, -3.89797338173e-9],
    [62, 34, -6.34892133651e-10, -2.68418874835e-9],
    [62, 35, 4.81220188647e-9, -1.1050809121e-9],
    [62, 36, 1.98835694401e-10, 1.45607681621e-9],
    [62, 37, 3.1989344437e-9, 2.14678064239e-9],
    [62, 38, -1.9204038709e-9, 6.16716406564e-10],
    [62, 39, 3.34515812506e-9, 4.14641645868e-10],
    [62, 40, -1.97564343514e-9, -3.01796072455e-9],
    [62, 41, -3.46235533318e-9, -2.28801858484e-9],
    [62, 42, 3.05698466749e-9, -3.75496202482e-9],
    [62, 43, -1.49676292878e-9, -6.29497016877e-10],
    [62, 44, 2.14448524507e-9, 1.88523590489e-9],
    [62, 45, -8.34405746235e-10, -3.14473935361e-9],
    [62, 46, -2.93265106212e-10, 7.32113148782e-10],
    [62, 47, -1.61097027092e-9, 2.36067104981e-9],
    [62, 48, -1.22663422627e-9, 2.26863893585e-9],
    [62, 49, -4.35640931502e-9, -1.16615535583e-9],
    [62, 50, -1.63330757231e-10, 2.1498411047e-9],
    [62, 51, -4.38726738595e-9, -3.96802276471e-9],
    [62, 52, 3.93436610456e-9, -5.09667879958e-9],
    [62, 53, -1.00799950303e-9, -2.80999022062e-9],
    [62, 54, 3.34171653799e-9, 4.31980290801e-9],
    [62, 55, 4.15162955519e-9, 2.89217219326e-11],
    [62, 56, -3.15377993659e-9, -4.24081055503e-10],
    [62, 57, 1.0586595415e-9, -4.61880778887e-9],
    [62, 58, -1.40569643369e-9, -1.53613608049e-9],
    [62, 59, -5.5231419587e-10, -2.48370856354e-9],
    [62, 60, 1.04592888237e-9, 1.33802317625e-9],
    [62, 61, 4.08644238679e-9, 2.25718184321e-9],
    [62, 62, -2.00900822244e-9, 1.78784558995e-10],
    [63, 0, -3.11323188816e-9, 0],
    [63, 1, -2.51686189527e-9, 1.62316204256e-9],
    [63, 2, -8.90843192658e-10, 6.81718264686e-10],
    [63, 3, -8.39031301916e-10, -2.44548956892e-9],
    [63, 4, -2.10000366689e-9, 5.43749942547e-9],
    [63, 5, 6.08074122005e-10, 4.96799913037e-10],
    [63, 6, 1.85063953353e-9, 3.98143826469e-9],
    [63, 7, -9.4591724858e-10, 2.40472808521e-9],
    [63, 8, -2.89932004112e-9, 3.38613792663e-9],
    [63, 9, -1.74572409463e-10, -6.29234474447e-9],
    [63, 10, 2.91384908681e-10, 1.86055697008e-9],
    [63, 11, 2.02338901184e-9, 2.83416273653e-9],
    [63, 12, 3.22282127238e-10, -2.83718782931e-10],
    [63, 13, 1.9165546e-9, 2.91987267964e-10],
    [63, 14, 6.85614070457e-9, 7.44701298692e-10],
    [63, 15, -2.22292094265e-9, -1.46986358223e-10],
    [63, 16, 5.45586135526e-9, 2.5447107979e-9],
    [63, 17, 8.19242799659e-10, -3.47276845232e-9],
    [63, 18, 3.2452033461e-10, 9.58039385266e-10],
    [63, 19, -3.49311292523e-9, 1.04309515111e-9],
    [63, 20, 1.08548702371e-9, -6.20691942833e-10],
    [63, 21, 2.26077252841e-9, -1.71675559459e-9],
    [63, 22, -1.95621527664e-9, -3.40025771807e-10],
    [63, 23, 1.55066871055e-10, 1.22701010925e-9],
    [63, 24, -2.9982830601e-10, -3.1587944662e-9],
    [63, 25, -2.17502892099e-9, 4.91124128506e-9],
    [63, 26, -9.763699194e-10, -2.98419489564e-9],
    [63, 27, 4.61914842747e-10, 1.1513783027e-9],
    [63, 28, -4.01774085142e-9, 2.92361907954e-9],
    [63, 29, 1.85891977799e-10, 2.08480055661e-9],
    [63, 30, -3.38969251367e-9, -2.27319487981e-9],
    [63, 31, -8.39426059679e-10, -1.64619521455e-9],
    [63, 32, -1.79567462932e-9, 2.46176880048e-9],
    [63, 33, -4.56754551113e-9, -5.00039494134e-10],
    [63, 34, 1.44503634241e-9, -1.81547180804e-9],
    [63, 35, 2.54403585631e-9, 7.06024902233e-10],
    [63, 36, 5.47662420889e-10, -2.87410509536e-9],
    [63, 37, 1.27402191828e-9, 4.68706935937e-9],
    [63, 38, 3.98567841752e-10, -1.39609037746e-9],
    [63, 39, 7.55740940248e-10, 1.60521678824e-9],
    [63, 40, 8.55632113051e-10, 2.57008846341e-9],
    [63, 41, -2.2719079497e-9, -1.01168365732e-9],
    [63, 42, -2.60989370838e-10, 3.0737496207e-10],
    [63, 43, -4.59413092619e-9, 2.90292831222e-9],
    [63, 44, -6.66532828203e-9, -2.48516212233e-9],
    [63, 45, -2.13918101329e-9, -2.93616863524e-9],
    [63, 46, 3.10023035748e-10, -9.932197143e-10],
    [63, 47, 2.2326087612e-9, -1.06199908232e-9],
    [63, 48, 5.77103738401e-9, -1.66141662191e-9],
    [63, 49, 1.15879077421e-9, 2.19039630221e-9],
    [63, 50, 8.01745944296e-11, 1.39194165977e-9],
    [63, 51, 1.33134320356e-9, 4.10408662176e-10],
    [63, 52, -1.23729693773e-9, 5.29634041035e-9],
    [63, 53, -2.77068914768e-9, -1.02325243932e-10],
    [63, 54, 4.00851845763e-9, -3.97139234308e-9],
    [63, 55, -6.75281686388e-9, 1.20594134079e-10],
    [63, 56, -6.71257955046e-12, -5.72047929224e-9],
    [63, 57, -1.335086838e-9, 1.47700036159e-9],
    [63, 58, 8.43695126698e-10, -1.1286807311e-9],
    [63, 59, 1.28568220684e-9, -4.13530494791e-9],
    [63, 60, 3.50937997067e-9, -1.10201123137e-9],
    [63, 61, -2.80180636796e-9, 4.20279339499e-9],
    [63, 62, -4.67509914354e-9, 2.23124114357e-10],
    [63, 63, -6.30771369746e-10, -1.76523876748e-10],
    [64, 0, -3.73169621228e-9, 0],
    [64, 1, 3.76376213548e-9, -5.07180055734e-10],
    [64, 2, -9.24862842874e-10, 3.1920267792e-9],
    [64, 3, -1.72270494949e-9, -1.62119696086e-9],
    [64, 4, -3.68668072276e-9, 2.41834589704e-9],
    [64, 5, -2.51488310983e-9, -2.94487537751e-9],
    [64, 6, -2.01024929819e-9, -6.39724799361e-10],
    [64, 7, -3.41586606618e-10, 6.17262972614e-10],
    [64, 8, -7.8471613681e-10, 1.03154245061e-9],
    [64, 9, -2.07689776845e-9, -2.88087764543e-9],
    [64, 10, 1.73326339943e-9, -2.83320535995e-10],
    [64, 11, -3.35846603846e-9, -4.90343305614e-9],
    [64, 12, 2.5446167118e-9, 2.00999167356e-9],
    [64, 13, -4.04870106251e-10, 3.49166719926e-10],
    [64, 14, -1.0847577208e-9, -1.34098578078e-9],
    [64, 15, -1.65459286344e-9, -9.73528542599e-10],
    [64, 16, 1.71443877312e-9, -1.75119041967e-9],
    [64, 17, -1.42072942905e-9, -9.67144104235e-10],
    [64, 18, 2.21883045993e-10, 2.57433234317e-9],
    [64, 19, 7.61917411362e-10, 1.16159259563e-9],
    [64, 20, -3.5702458407e-9, -2.01669668151e-9],
    [64, 21, 6.40338941823e-10, -3.45409876865e-10],
    [64, 22, 2.19732276428e-9, 1.53596119755e-9],
    [64, 23, -3.74339752252e-9, -4.24709371318e-10],
    [64, 24, -3.97595261711e-9, -3.03420483296e-9],
    [64, 25, 8.46185574611e-10, 6.48412688994e-10],
    [64, 26, -1.14267224817e-9, -1.93150140378e-9],
    [64, 27, -5.1645342642e-10, -2.43656363976e-9],
    [64, 28, -1.23284404405e-9, 4.01583362155e-9],
    [64, 29, 4.02684008899e-11, -3.00728871328e-9],
    [64, 30, -2.92004796971e-9, 1.02150517616e-9],
    [64, 31, 2.18474041911e-9, 4.48655283674e-10],
    [64, 32, 8.75987820485e-10, 2.52893755341e-9],
    [64, 33, -1.87912322554e-9, 1.71603401009e-10],
    [64, 34, 1.79621994755e-9, -1.31901490212e-9],
    [64, 35, -6.33646126499e-9, 1.13591245202e-9],
    [64, 36, -9.96582328624e-10, -1.14185529689e-9],
    [64, 37, 1.66437720718e-9, 1.81218712015e-10],
    [64, 38, 1.98963395542e-9, -1.97920702361e-9],
    [64, 39, -9.125460243e-11, -3.30817398171e-9],
    [64, 40, 4.43435618785e-9, 1.136074619e-9],
    [64, 41, 6.34456764915e-10, 2.43348147864e-11],
    [64, 42, 1.71084432122e-9, -8.03950943e-10],
    [64, 43, 8.10031367696e-10, 1.44584750275e-9],
    [64, 44, -4.67665458327e-9, 2.16848162797e-9],
    [64, 45, -1.18748463091e-9, -1.40730693063e-9],
    [64, 46, 2.16017450352e-9, 4.72682080065e-10],
    [64, 47, -2.68013474895e-9, 3.37431149754e-10],
    [64, 48, 1.17426333143e-9, -2.71445739102e-9],
    [64, 49, -2.7971431255e-10, 2.20184368706e-9],
    [64, 50, -5.77048712893e-9, -3.46186122046e-9],
    [64, 51, 1.43171268392e-10, 4.34194817246e-10],
    [64, 52, 4.09697345325e-9, -4.74094979041e-9],
    [64, 53, 2.8709974537e-9, 7.70846474676e-10],
    [64, 54, 1.08666921932e-10, -1.57408401726e-9],
    [64, 55, 1.82625588706e-9, 2.51549344391e-9],
    [64, 56, 1.98086149943e-9, 3.68123411897e-9],
    [64, 57, -2.45549869317e-9, -4.62008838509e-10],
    [64, 58, -9.8827803031e-11, -3.88970334422e-10],
    [64, 59, -8.20562102321e-9, -3.89634437444e-10],
    [64, 60, -3.57181043853e-10, 1.29284413577e-9],
    [64, 61, -4.16773169308e-9, -2.46899990294e-9],
    [64, 62, -1.4531395877e-9, -9.3731634589e-10],
    [64, 63, 2.13192209173e-9, -5.20127627973e-9],
    [64, 64, 4.73473307973e-9, -1.22580782542e-9],
    [65, 0, -4.49700157417e-10, 0],
    [65, 1, -2.58252024183e-9, -4.15450712677e-9],
    [65, 2, -2.2104270434e-10, 4.83397052848e-10],
    [65, 3, -2.36678018155e-9, 3.20183068444e-11],
    [65, 4, 5.2100168159e-10, -2.07353402035e-9],
    [65, 5, -3.37318578285e-9, -9.80828952124e-10],
    [65, 6, 1.77113417665e-9, 2.65458974323e-10],
    [65, 7, -2.80195644682e-9, -3.81524978856e-10],
    [65, 8, 9.18508312373e-10, 1.46877084573e-9],
    [65, 9, 4.09291433793e-10, 1.70293430933e-9],
    [65, 10, 1.17202785935e-9, -1.82734012829e-9],
    [65, 11, -3.45390399841e-9, -1.30446444472e-9],
    [65, 12, 8.78057582595e-11, 1.53944173183e-9],
    [65, 13, -8.39253328685e-10, 1.37821378529e-9],
    [65, 14, -6.79335041424e-9, -4.10228968157e-9],
    [65, 15, 1.04636810014e-9, 1.28072126503e-9],
    [65, 16, -2.22500917889e-9, -4.68241234575e-9],
    [65, 17, -1.94176523451e-9, -3.21800497765e-9],
    [65, 18, -1.57811301525e-9, -1.9004772194e-9],
    [65, 19, -3.99314337913e-9, -2.07946712601e-10],
    [65, 20, -3.09733922649e-9, -7.29286676998e-10],
    [65, 21, 2.13441992479e-9, -3.95401029335e-10],
    [65, 22, 2.78219752005e-9, -1.62660900267e-10],
    [65, 23, 9.79585870986e-10, 4.1820999658e-9],
    [65, 24, -1.33788962497e-9, 1.0848317985e-10],
    [65, 25, 6.30777406339e-10, -2.71766913018e-9],
    [65, 26, -3.13474520827e-9, -1.30761274631e-9],
    [65, 27, -5.80708325406e-10, -2.86664407159e-9],
    [65, 28, -5.43137361736e-11, 5.12383601723e-10],
    [65, 29, -9.94050537128e-10, -3.27026311337e-9],
    [65, 30, 4.88503726153e-9, -3.69337655843e-12],
    [65, 31, 1.34169586141e-9, 8.2319848075e-11],
    [65, 32, -1.00790417787e-9, 1.34426957565e-9],
    [65, 33, 1.40894367868e-9, -3.26567943193e-10],
    [65, 34, 1.33546938004e-9, -1.88502484312e-9],
    [65, 35, -2.33702467742e-9, 3.52419338735e-9],
    [65, 36, -1.71328973912e-9, -2.60753316393e-9],
    [65, 37, 4.69236054434e-9, -1.41853467166e-9],
    [65, 38, -1.48717409763e-9, 4.60043687618e-9],
    [65, 39, -1.7482048758e-9, 9.01873043733e-10],
    [65, 40, -1.06693552129e-9, -1.33561086842e-10],
    [65, 41, 1.17477093691e-9, -1.43166580606e-9],
    [65, 42, 3.22470451029e-9, -4.06953175811e-9],
    [65, 43, 2.19284640134e-9, 2.53498415372e-10],
    [65, 44, 1.63348352736e-9, 1.9878281002e-9],
    [65, 45, -1.74013929931e-9, 1.60635944849e-9],
    [65, 46, 3.27076453121e-9, 1.78940435427e-9],
    [65, 47, 8.71190196918e-10, 2.43618421166e-9],
    [65, 48, 1.14717202955e-9, -6.14373757975e-10],
    [65, 49, -2.82120730113e-10, 1.61953979687e-9],
    [65, 50, -5.97595871229e-9, 1.05926972566e-9],
    [65, 51, 9.29243945476e-10, -2.83214662335e-9],
    [65, 52, -6.92950682227e-10, 1.75202265903e-9],
    [65, 53, -4.45601414026e-9, -6.69013561037e-10],
    [65, 54, 2.57788799305e-9, 1.56043265018e-9],
    [65, 55, -3.08573779721e-9, 4.28018701586e-9],
    [65, 56, -1.22162660378e-9, -3.51405424115e-9],
    [65, 57, -6.97477432819e-10, 2.80824482607e-10],
    [65, 58, -8.15095777111e-10, -9.49109002564e-10],
    [65, 59, 3.01627691047e-9, -2.22014114762e-9],
    [65, 60, 5.837589064e-10, 2.10135997859e-9],
    [65, 61, -3.73468905093e-9, 2.7588051257e-9],
    [65, 62, 9.54228600032e-10, 5.20758598302e-10],
    [65, 63, 4.6276034765e-11, -3.55002565884e-9],
    [65, 64, 1.0700400242e-9, 4.06400819266e-9],
    [65, 65, 4.39724757879e-10, 2.07365336654e-9],
    [66, 0, -2.46080003028e-10, 0],
    [66, 1, -1.28065746519e-9, -1.57412839904e-9],
    [66, 2, 2.34745365439e-9, -8.04093108405e-10],
    [66, 3, 1.64372527654e-9, -1.25663719403e-9],
    [66, 4, 1.49077004447e-10, -3.67316716915e-9],
    [66, 5, 5.59171551078e-9, 4.14147390335e-9],
    [66, 6, 2.07017985399e-9, -2.55120536295e-9],
    [66, 7, -8.12659019352e-10, 2.61708049597e-9],
    [66, 8, -8.19626488906e-10, 6.57427903212e-10],
    [66, 9, 3.44914762848e-10, 4.80665530774e-9],
    [66, 10, -8.92356816687e-10, -4.17660342112e-9],
    [66, 11, -7.34735206563e-10, 6.45722272265e-10],
    [66, 12, 2.40361383606e-9, -4.39247384868e-9],
    [66, 13, -3.80151814177e-9, 2.08797347339e-9],
    [66, 14, -3.71560143727e-9, -1.61013083285e-9],
    [66, 15, 2.03456172266e-9, -2.02940527474e-9],
    [66, 16, -2.15299949683e-9, 1.07601267969e-10],
    [66, 17, -1.533446216e-9, -8.01648652589e-10],
    [66, 18, -9.23201640766e-10, -2.27991476957e-9],
    [66, 19, -1.85878907062e-9, -2.02876213355e-9],
    [66, 20, -1.35598488141e-9, -9.49723141818e-10],
    [66, 21, -3.39054996066e-10, -2.2869485706e-9],
    [66, 22, 3.05070268661e-9, 1.80845190814e-9],
    [66, 23, 3.26511997039e-9, 2.6870080805e-9],
    [66, 24, -4.22613583813e-10, 3.66433428177e-10],
    [66, 25, 2.31776769093e-9, -1.26691797154e-9],
    [66, 26, 3.15505637998e-9, 4.66754632974e-11],
    [66, 27, 3.0801881097e-9, -1.80875685191e-9],
    [66, 28, 8.88888507814e-10, -2.49407088085e-9],
    [66, 29, -2.83888509233e-9, 2.14250673403e-9],
    [66, 30, 3.59861088413e-9, -2.19173977704e-9],
    [66, 31, -2.50452549834e-9, 5.5058973509e-10],
    [66, 32, -1.2283025383e-9, 8.66202505229e-10],
    [66, 33, 1.62809319304e-10, -4.05313499364e-9],
    [66, 34, 1.01641044049e-10, 1.61083907079e-9],
    [66, 35, 2.26749821285e-9, -2.59091286461e-10],
    [66, 36, -1.74492944838e-9, -2.94892711725e-9],
    [66, 37, 5.37220534397e-10, 2.10366324147e-9],
    [66, 38, 1.216739408e-9, 3.50806535047e-9],
    [66, 39, -7.47245877963e-10, 4.75757362048e-9],
    [66, 40, -2.6148818883e-9, -3.05295489507e-9],
    [66, 41, -1.34263034623e-9, 3.51016861251e-9],
    [66, 42, -4.07115980951e-9, -2.75323134714e-9],
    [66, 43, -5.11700482594e-10, -1.95881197689e-9],
    [66, 44, 9.2810507186e-10, -4.17578472252e-9],
    [66, 45, 7.97009080411e-10, -6.181933191e-10],
    [66, 46, -3.02469342318e-10, -3.21816833857e-9],
    [66, 47, 4.43898274216e-9, -1.29092928467e-9],
    [66, 48, 4.32302925677e-9, 8.72002315022e-10],
    [66, 49, 1.1256303067e-9, 3.11853480981e-9],
    [66, 50, -2.90736749125e-9, 1.21990539613e-9],
    [66, 51, -1.52977232346e-9, -2.22741147051e-9],
    [66, 52, -1.9410318709e-9, -7.54379990197e-10],
    [66, 53, -2.28531717671e-9, -4.79961192884e-9],
    [66, 54, -9.90575278445e-10, -2.75065849164e-9],
    [66, 55, -9.16359078237e-10, -2.59784718191e-9],
    [66, 56, -1.48822320099e-9, 5.37962756137e-10],
    [66, 57, 1.81191688288e-9, 4.29611183844e-9],
    [66, 58, -1.39216439838e-9, -1.19813455446e-9],
    [66, 59, 2.24314087244e-9, 3.60067998522e-9],
    [66, 60, -6.91709045474e-10, -3.15025079306e-9],
    [66, 61, 4.60170257846e-10, -2.06501520839e-10],
    [66, 62, 6.47779303293e-9, 1.12238545137e-9],
    [66, 63, 1.73411427612e-9, 4.57782363596e-9],
    [66, 64, 1.78967452006e-9, -1.57855506169e-9],
    [66, 65, -2.45456112119e-9, 4.44671335257e-9],
    [66, 66, -3.47054036103e-9, -6.7767854956e-10],
    [67, 0, -9.70600910807e-11, 0],
    [67, 1, -2.29081976138e-9, 1.83069076028e-9],
    [67, 2, -8.93767112479e-11, -4.4531896111e-9],
    [67, 3, 4.79528821744e-10, 1.41611633919e-10],
    [67, 4, -1.3010111803e-9, 1.6708730767e-9],
    [67, 5, 1.27549289916e-9, 2.83541771197e-9],
    [67, 6, -8.56200869439e-10, 2.99565427775e-11],
    [67, 7, -4.16600419272e-9, -1.9656227656e-9],
    [67, 8, 2.42099295921e-9, -2.50333448071e-9],
    [67, 9, 2.94090279351e-9, 3.24401108141e-9],
    [67, 10, 1.20334564166e-9, -8.11985361739e-11],
    [67, 11, 2.56182981127e-9, 6.6985674784e-11],
    [67, 12, -3.08184864088e-9, -1.67641150508e-9],
    [67, 13, 3.49595124999e-9, -1.97298991279e-9],
    [67, 14, 1.71807449095e-9, 7.86238154089e-10],
    [67, 15, 1.63712062651e-9, -1.24369833755e-9],
    [67, 16, 6.43651337235e-10, 1.38851723951e-9],
    [67, 17, -2.12956795961e-9, -1.52672910521e-9],
    [67, 18, -6.47845364648e-10, 1.53480409772e-9],
    [67, 19, -5.12794034098e-10, 2.53182474384e-10],
    [67, 20, 3.20858111688e-9, -2.11272787851e-9],
    [67, 21, -2.17998313799e-9, 1.12446974143e-10],
    [67, 22, -3.49742528914e-9, 4.59811942642e-9],
    [67, 23, 3.4098842644e-9, -6.89624268719e-10],
    [67, 24, 2.27899679676e-9, -2.57735858851e-9],
    [67, 25, 3.87394808496e-9, 5.15092550916e-10],
    [67, 26, 3.97718098592e-9, 3.43669823837e-10],
    [67, 27, 1.55115582914e-9, 5.41029455653e-10],
    [67, 28, -1.29235783455e-9, -1.97556344252e-9],
    [67, 29, -6.47188363153e-10, 9.87198851228e-10],
    [67, 30, 1.2511202801e-9, -1.18881541506e-9],
    [67, 31, -1.21695629788e-9, 4.05088510438e-9],
    [67, 32, -1.03723838016e-9, -2.78412570445e-9],
    [67, 33, -1.66917319833e-9, 3.90247938573e-10],
    [67, 34, 5.53318831088e-10, 2.00120482971e-9],
    [67, 35, -2.18415383088e-9, -2.19431098073e-9],
    [67, 36, -2.12886983784e-9, -1.29816163047e-9],
    [67, 37, -3.1221499799e-9, -7.40146127614e-10],
    [67, 38, 1.77793883256e-9, 6.54974300427e-11],
    [67, 39, -1.01847352521e-9, -5.00107072625e-10],
    [67, 40, -6.00263408446e-10, -2.57662776533e-10],
    [67, 41, -8.37215400184e-11, -2.17071138968e-9],
    [67, 42, -7.13914481263e-10, 2.24217183671e-9],
    [67, 43, 2.73853766349e-9, -2.31213529448e-9],
    [67, 44, -5.88852767581e-10, 4.98869264517e-10],
    [67, 45, -1.68320299458e-9, 1.84663341563e-9],
    [67, 46, -3.50379312535e-9, -5.93655184371e-11],
    [67, 47, -1.25936184153e-9, -2.59457961533e-9],
    [67, 48, 3.89025031566e-9, -2.9258716078e-9],
    [67, 49, 2.48429469418e-10, 2.49247839939e-9],
    [67, 50, 1.54518367755e-9, -1.35102427225e-9],
    [67, 51, 5.42093470358e-9, -2.41251010782e-9],
    [67, 52, 5.6358963472e-9, 1.18281309422e-9],
    [67, 53, 1.14286262595e-9, 2.48345077696e-10],
    [67, 54, 9.70571114173e-10, -6.73506051992e-10],
    [67, 55, 7.94794713622e-11, 8.45590167352e-9],
    [67, 56, -4.30248334908e-9, -4.49145126159e-9],
    [67, 57, 2.64068400942e-9, -2.33006032025e-9],
    [67, 58, -2.21100358212e-9, -1.7747510894e-9],
    [67, 59, 8.51075248646e-10, -3.0677447471e-9],
    [67, 60, 3.33062636434e-9, 5.4350350605e-10],
    [67, 61, 3.24810670649e-9, -2.86230086602e-9],
    [67, 62, 4.60475441645e-9, -5.35741788057e-9],
    [67, 63, 1.61734805988e-9, 6.07172241858e-9],
    [67, 64, 2.37434931475e-10, -2.52570973448e-9],
    [67, 65, -9.28328734397e-10, 1.64390058476e-10],
    [67, 66, 6.55002006029e-10, -9.09600278796e-10],
    [67, 67, -9.50180598953e-10, 3.01607088542e-9],
    [68, 0, 4.622867674e-10, 0],
    [68, 1, 2.14389674388e-10, 2.89815535129e-9],
    [68, 2, -2.37512902633e-9, -1.4364671025e-9],
    [68, 3, -3.56686339804e-9, 1.68884850602e-9],
    [68, 4, 1.99011722043e-9, -3.00148260597e-10],
    [68, 5, -4.59846510744e-10, 1.63949808477e-10],
    [68, 6, 1.19909005894e-9, 9.93918144753e-10],
    [68, 7, 1.60259621356e-10, -4.62044972394e-9],
    [68, 8, -2.49131338946e-9, 1.13358666599e-9],
    [68, 9, 1.35011786475e-9, -1.02222266629e-9],
    [68, 10, -9.07282679631e-10, 1.98941003067e-9],
    [68, 11, 4.55131313295e-9, -2.82933353176e-9],
    [68, 12, 1.62386503597e-9, 4.79842004824e-10],
    [68, 13, 1.30142879772e-9, -2.97295561864e-9],
    [68, 14, -3.99914489776e-10, -6.06613397759e-10],
    [68, 15, 3.13432101427e-9, -4.46153095223e-10],
    [68, 16, 1.11243292176e-9, -3.49524061965e-9],
    [68, 17, -1.64516717866e-9, -1.94954009834e-10],
    [68, 18, -6.1046895199e-10, 1.2346216227e-9],
    [68, 19, 5.76269396455e-9, 5.90400376681e-10],
    [68, 20, 3.72514825591e-9, -1.01123073591e-9],
    [68, 21, -2.12124079126e-9, 2.8035922654e-9],
    [68, 22, -2.91851474027e-9, -2.55665889195e-9],
    [68, 23, -2.98926892706e-9, 5.03312299296e-10],
    [68, 24, 2.80539054764e-9, 9.92106952572e-10],
    [68, 25, -5.3456271182e-10, 2.828677668e-9],
    [68, 26, -1.29487951875e-9, 7.84713085411e-10],
    [68, 27, -1.45580303513e-9, -1.78251331664e-10],
    [68, 28, 8.56958052323e-10, 4.74930598993e-12],
    [68, 29, 1.85693685103e-9, -2.13352830826e-9],
    [68, 30, 8.51586406583e-10, 1.22243340175e-9],
    [68, 31, 8.09758005105e-10, 3.21126059116e-11],
    [68, 32, -3.74151227867e-9, 1.38253707945e-9],
    [68, 33, 2.95585410206e-9, -5.08867565026e-10],
    [68, 34, -1.1511407971e-9, 2.5288100685e-9],
    [68, 35, -2.47359448852e-9, -5.7190507076e-10],
    [68, 36, 3.8353605107e-9, 2.18682851374e-9],
    [68, 37, -4.44495964019e-9, 3.21409235524e-9],
    [68, 38, -2.92119501854e-9, -3.13656586965e-9],
    [68, 39, -2.14645663214e-9, -1.32509636217e-10],
    [68, 40, 3.74676075468e-10, -1.15470256723e-9],
    [68, 41, 4.49796214496e-9, -5.19779580556e-9],
    [68, 42, -1.68396305652e-9, 2.22930554963e-9],
    [68, 43, 1.81911859588e-9, -1.47054826998e-9],
    [68, 44, 2.28359889578e-9, 3.78535230123e-9],
    [68, 45, -1.35348411074e-9, 1.9282466118e-9],
    [68, 46, -3.55990977948e-9, -3.04004180215e-10],
    [68, 47, -1.69026318159e-9, -1.2307994624e-9],
    [68, 48, -9.82869768453e-10, -4.99616501979e-10],
    [68, 49, -1.39389634883e-10, 2.2099814424e-9],
    [68, 50, -2.95325598076e-9, 1.67830147109e-10],
    [68, 51, 3.83992802073e-9, -1.95341587325e-9],
    [68, 52, -1.62157993428e-9, 7.319588969e-10],
    [68, 53, -2.18473305067e-9, 9.88184535213e-11],
    [68, 54, -1.22279421158e-9, -7.94633823961e-11],
    [68, 55, 2.3893626516e-10, -2.97714708723e-9],
    [68, 56, 2.51796520839e-9, -5.59608521466e-9],
    [68, 57, 3.24416409777e-9, 8.57865506596e-10],
    [68, 58, 1.67555546432e-9, 7.91667114823e-10],
    [68, 59, 5.9401839327e-9, 4.24238464488e-9],
    [68, 60, -2.00991284287e-9, 1.76503569831e-9],
    [68, 61, 9.15003757775e-11, 5.24523070638e-10],
    [68, 62, 3.34298236266e-9, 1.49076627872e-9],
    [68, 63, 3.51331088148e-10, -4.69838516852e-9],
    [68, 64, -3.5937231919e-9, -3.1551468217e-9],
    [68, 65, 2.57230439055e-9, -1.70007563881e-10],
    [68, 66, 7.64376811898e-10, -1.19675114041e-9],
    [68, 67, 3.97516337811e-9, -1.25148542112e-9],
    [68, 68, -1.24227662661e-9, 1.60834722967e-9],
    [69, 0, 9.63993353786e-10, 0],
    [69, 1, 1.92526606206e-9, -2.8133913213e-9],
    [69, 2, -2.8935827017e-9, 1.76152264336e-9],
    [69, 3, 3.34285932041e-9, -2.86282518908e-9],
    [69, 4, -1.69394355265e-9, 3.11294310992e-10],
    [69, 5, 2.6461204935e-9, 2.39401047688e-9],
    [69, 6, 1.774821922e-9, 3.01493117393e-9],
    [69, 7, 1.44494812935e-9, -5.17419313015e-10],
    [69, 8, -1.32528306016e-9, 2.54606090264e-9],
    [69, 9, -1.49404008265e-9, 5.89991830024e-10],
    [69, 10, 3.32081797198e-10, -2.02658661512e-10],
    [69, 11, -1.43251299307e-9, 2.61526439472e-9],
    [69, 12, 9.51227112014e-10, 1.1959073126e-9],
    [69, 13, 3.153562295e-10, -5.82253635242e-9],
    [69, 14, 9.33653438236e-10, 1.25780802552e-9],
    [69, 15, 4.66883441717e-11, -4.27931736764e-9],
    [69, 16, -2.65763987804e-9, -4.21789208734e-9],
    [69, 17, 1.12900714413e-9, -3.70550920353e-9],
    [69, 18, -6.04412438452e-10, -1.45386268446e-9],
    [69, 19, 2.46582140419e-9, 2.60052302148e-9],
    [69, 20, 4.02398095005e-9, -7.75925005443e-10],
    [69, 21, -2.06255752376e-9, 3.28241838767e-9],
    [69, 22, -3.67140285211e-9, -1.25090935129e-9],
    [69, 23, -1.36236915424e-9, 1.27800489685e-9],
    [69, 24, 2.6733597038e-9, 2.6628067101e-9],
    [69, 25, -1.60703311015e-9, -9.06417794325e-10],
    [69, 26, -5.27392627157e-9, 3.35712999267e-9],
    [69, 27, -2.75782645738e-9, -1.21186122033e-10],
    [69, 28, -5.9796767821e-10, -1.83094536519e-10],
    [69, 29, -7.96856441546e-10, -9.50794257622e-10],
    [69, 30, -8.32913895383e-10, 1.39518191574e-9],
    [69, 31, -1.14925576425e-9, -1.33033646108e-9],
    [69, 32, 4.53032712519e-10, -5.86278587798e-10],
    [69, 33, 4.33790565334e-9, 1.6729242647e-10],
    [69, 34, -1.42850247379e-9, 1.87004795004e-9],
    [69, 35, -1.99678038855e-9, 1.75746889352e-9],
    [69, 36, 3.12966485288e-9, 1.23258762222e-9],
    [69, 37, -1.54550507614e-9, 5.79711088717e-9],
    [69, 38, -3.80614320102e-9, -9.73592892592e-10],
    [69, 39, -6.15275945642e-10, -3.80756590592e-10],
    [69, 40, -7.19309221802e-10, -3.99138103532e-9],
    [69, 41, -1.24977041744e-9, -6.70895165055e-10],
    [69, 42, -2.43832760013e-9, 2.04630503984e-9],
    [69, 43, -9.13698487452e-10, 4.52883310127e-10],
    [69, 44, 1.89469835595e-9, -1.97186470672e-9],
    [69, 45, 1.65118718058e-9, 6.09100767657e-10],
    [69, 46, -6.4839573879e-10, -1.65450131078e-9],
    [69, 47, 1.2140409732e-9, 1.6557251096e-9],
    [69, 48, -3.41539585753e-10, 9.17817197774e-10],
    [69, 49, 2.63575298368e-9, 1.40568990624e-9],
    [69, 50, -3.22601530758e-10, -7.6308861688e-10],
    [69, 51, 1.20621592065e-9, -1.51579359894e-9],
    [69, 52, -2.24673502188e-9, 5.54730952319e-10],
    [69, 53, -3.10720876998e-9, -4.1612253675e-9],
    [69, 54, 2.93359257365e-9, -3.22442493457e-9],
    [69, 55, 2.93178903783e-9, -2.09539406352e-9],
    [69, 56, -9.53111140964e-10, -1.55097658547e-9],
    [69, 57, 2.7450334232e-9, -1.13045216393e-9],
    [69, 58, -3.19656528832e-9, 2.19720503411e-9],
    [69, 59, -1.67298931099e-9, -5.01099598366e-9],
    [69, 60, -1.98562528429e-10, -1.29846121033e-9],
    [69, 61, 2.55087831644e-9, -4.69351095909e-9],
    [69, 62, -6.2232159098e-10, -2.68462163107e-12],
    [69, 63, 2.3387371477e-9, 1.9728626085e-9],
    [69, 64, -3.52429015789e-9, 2.87520786627e-9],
    [69, 65, 1.7081215097e-9, -8.33404969847e-10],
    [69, 66, -8.31341739423e-9, 7.93134556226e-10],
    [69, 67, 3.44107294401e-10, 3.26994561866e-9],
    [69, 68, -8.85030034956e-10, 1.66551866504e-9],
    [69, 69, 1.70476744606e-9, -2.26235749288e-9],
    [70, 0, -1.71482882924e-9, 0],
    [70, 1, -3.38928907067e-10, -2.88456331103e-9],
    [70, 2, 1.21603976762e-9, 1.2870504057e-9],
    [70, 3, 1.48336168294e-9, -5.76144683588e-10],
    [70, 4, 2.17979853929e-9, 2.18513828706e-9],
    [70, 5, 3.84014508872e-11, 2.84702883631e-9],
    [70, 6, -1.27905563633e-9, 2.67940253701e-10],
    [70, 7, -3.08665924605e-10, 1.53919081163e-9],
    [70, 8, 2.52323197847e-9, -6.70150204256e-10],
    [70, 9, -3.50491149039e-10, -7.66123521311e-10],
    [70, 10, -3.93137957749e-10, -7.77999857261e-10],
    [70, 11, -1.607623497e-9, 3.57436902821e-9],
    [70, 12, 7.29456777131e-10, 1.81327042928e-9],
    [70, 13, 1.52921431659e-9, -9.08141016609e-10],
    [70, 14, 3.11544958374e-9, 1.75752396627e-10],
    [70, 15, -1.8882318919e-9, 1.72257715142e-9],
    [70, 16, -9.29141700559e-10, -6.55653978482e-10],
    [70, 17, 5.56236170485e-10, -6.28514435912e-12],
    [70, 18, -3.43063253068e-9, -1.75414855846e-10],
    [70, 19, 4.90184567036e-10, -1.46152045815e-9],
    [70, 20, -3.88744196496e-9, 4.90515540198e-10],
    [70, 21, 1.4947338297e-9, -1.15148223093e-9],
    [70, 22, -1.4755207082e-9, -1.1629059083e-9],
    [70, 23, 1.34163029601e-9, -9.37018449968e-10],
    [70, 24, -1.35492495877e-9, 2.0580759896e-9],
    [70, 25, -1.18306589565e-9, -7.65844602451e-10],
    [70, 26, -2.37013864226e-9, 1.20108315983e-9],
    [70, 27, -1.43529853423e-9, -5.59311641806e-10],
    [70, 28, -2.05168494367e-9, 1.4707492301e-9],
    [70, 29, 8.7712658066e-10, 2.47071775335e-9],
    [70, 30, 6.97060334644e-10, 1.12187714868e-9],
    [70, 31, -1.8649358863e-9, -1.64032595079e-9],
    [70, 32, -7.24413367948e-10, -3.03848768417e-10],
    [70, 33, -3.68285551517e-10, 1.95832177686e-10],
    [70, 34, 1.6798458485e-9, 7.73871270488e-10],
    [70, 35, -5.13445081164e-9, -3.237743274e-9],
    [70, 36, 1.47021864039e-9, -9.60525481357e-10],
    [70, 37, -2.48993292727e-9, 1.71706585516e-9],
    [70, 38, -9.19590434285e-10, -2.16822987322e-9],
    [70, 39, 3.77157596281e-9, -2.51912367651e-9],
    [70, 40, -1.89559561315e-9, 6.18448239263e-10],
    [70, 41, 3.95017120086e-9, 1.1275245648e-9],
    [70, 42, -1.03691130162e-9, 1.60153939732e-9],
    [70, 43, -2.80832451521e-9, -1.68977517117e-9],
    [70, 44, 1.07181018831e-9, 1.13996612143e-10],
    [70, 45, -1.56477184271e-9, 2.94803771873e-9],
    [70, 46, -2.39645581194e-9, -1.35792029683e-9],
    [70, 47, -2.90231881102e-11, -2.44277059227e-9],
    [70, 48, 1.36615152338e-9, -2.97077558552e-9],
    [70, 49, 4.6560135101e-10, -5.53665111283e-10],
    [70, 50, 5.46237634132e-9, 3.19942965724e-10],
    [70, 51, 1.39550464898e-9, 2.60046110695e-9],
    [70, 52, -2.84537646237e-10, 3.67154593291e-9],
    [70, 53, -3.55081182197e-9, 4.39207589998e-10],
    [70, 54, 2.56776114205e-9, 2.34322445827e-9],
    [70, 55, -2.24518440142e-9, 2.26909500111e-9],
    [70, 56, 2.52200475493e-9, 2.48728106737e-9],
    [70, 57, 3.1954224154e-10, -1.49352336318e-9],
    [70, 58, -2.90160070799e-9, -2.88470834933e-9],
    [70, 59, 5.61008849453e-9, -2.43866394761e-9],
    [70, 60, -8.19756085699e-10, 3.66291140634e-9],
    [70, 61, 1.09976091083e-9, -1.99501732281e-9],
    [70, 62, 1.43884022365e-9, 2.20176786716e-9],
    [70, 63, -2.92835943703e-9, 1.74427149136e-9],
    [70, 64, -2.06939325906e-9, 1.50580174247e-9],
    [70, 65, 1.01927742435e-9, 1.77562303694e-9],
    [70, 66, -2.01747264436e-9, 1.99936625532e-9],
    [70, 67, 9.15317043771e-10, -3.61346894585e-10],
    [70, 68, -3.18317122673e-9, 1.84447016699e-9],
    [70, 69, -2.20353040552e-9, 9.94013069152e-10],
    [70, 70, -4.70375138826e-10, -6.48306137833e-10]
  ];
  let tables = {
    sigmaI: [
        [0,0,1,0,6288774],
        [2,0,-1,0,1274027],
        [2,0,0,0,658314],
        [0,0,2,0,213618],
        [0,1,0,0,-185116],
        [0,0,0,2,-114332],
        [2,0,-2,0,58793],
        [2,-1,-1,0,57066],
        [2,0,1,0,53322],
        [2,-1,0,0,45758],
        [0,1,-1,0,-40923],
        [1,0,0,0,-34720],
        [0,1,1,0,-30383],
        [2,0,0,-2,15327],
        [0,0,1,2,-12528],
        [0,0,1,-2,10980],
        [4,0,-1,0,10675],
        [0,0,3,0,10034],
        [4,0,-2,0,8548],
        [2,1,-1,0,-7888],
        [2,1,0,0,-6766],
        [1,0,-1,0,-5163],
        [1,1,0,0,4987],
        [2,-1,1,0,4036],
        [2,0,2,0,3994],
        [4,0,0,0,3861],
        [2,0,-3,0,3665],
        [0,1,-2,0,-2689],
        [2,0,-1,2,-2602],
        [2,-1,-2,0,2390],
        [1,0,1,0,-2348],
        [2,-2,0,0,2236],
        [0,1,2,0,-2120],
        [0,2,0,0,-2069],
        [2,-2,-1,0,2048],
        [2,0,1,-2,-1773],
        [2,0,0,2,-1595],
        [4,-1,-1,0,1215],
        [0,0,2,2,-1110],
        [3,0,-1,0,-892],
        [2,1,1,0,-810],
        [4,-1,-2,0,759],
        [0,2,-1,0,-713],
        [2,2,-1,0,-700],
        [2,1,-2,0,691],
        [2,-1,0,-2,596],
        [4,0,1,0,549],
        [0,0,4,0,537],
        [4,-1,0,0,520],
        [1,0,-2,0,-487],
        [2,1,0,-2,-399],
        [0,0,2,-2,-381],
        [1,1,1,0,351],
        [3,0,-2,0,-340],
        [4,0,-3,0,330],
        [2,-1,2,0,327],
        [0,2,1,0,-323],
        [1,1,-1,0,299],
        [2,0,3,0,294]
    ],
    sigmaR: [
        [0,0,1,0,-20905355],
        [2,0,-1,0,-3699111],
        [2,0,0,0,-2955968],
        [0,0,2,0,-569925],
        [0,1,0,0,48888],
        [0,0,0,2,-3149],
        [2,0,-2,0,246158],
        [2,-1,-1,0,-152138],
        [2,0,1,0,-170733],
        [2,-1,0,0,-204586],
        [0,1,-1,0,-129620],
        [1,0,0,0,108743],
        [0,1,1,0,104755],
        [2,0,0,-2,10321],
        [0,0,1,-2,79661],
        [4,0,-1,0,-34782],
        [0,0,3,0,-23210],
        [4,0,-2,0,-21636],
        [2,1,-1,0,24208],
        [2,1,0,0,30824],
        [1,0,-1,0,-8379],
        [1,1,0,0,-16675],
        [2,-1,1,0,-12831],
        [2,0,2,0,-10445],
        [4,0,0,0,-11650],
        [2,0,-3,0,14403],
        [0,1,-2,0,-7003],
        [2,-1,-2,0,10056],
        [1,0,1,0,6322],
        [2,-2,0,0,-9884],
        [0,1,2,0,5751],
        [2,-2,-1,0,-4950],
        [2,0,1,-2,4130],
        [4,-1,-1,0,-3958],
        [3,0,-1,0,3258],
        [2,1,1,0,2616],
        [4,-1,-2,0,-1897],
        [0,2,-1,0,-2117],
        [2,2,-1,0,2354],
        [4,0,1,0,-1423],
        [0,0,4,0,-1117],
        [4,-1,0,0,-1571],
        [1,0,-2,0,-1739],
        [0,0,2,-2,-4421],
        [0,2,1,0,1165],
        [2,0,-1,-2,8752]
    ],
    sigmaB: [
        [0,0,0,1,5128122],
        [0,0,1,1,280602],
        [0,0,1,-1,277693],
        [2,0,0,-1,173237],
        [2,0,-1,1,55413],
        [2,0,-1,-1,46271],
        [2,0,0,1,32573],
        [0,0,2,1,17198],
        [2,0,1,-1,9266],
        [0,0,2,-1,8822],
        [2,-1,0,-1,8216],
        [2,0,-2,-1,4324],
        [2,0,1,1,4200],
        [2,1,0,-1,-3359],
        [2,-1,-1,1,2463],
        [2,-1,0,1,2211],
        [2,-1,-1,-1,2065],
        [0,1,-1,-1,-1870],
        [4,0,-1,-1,1828],
        [0,1,0,1,-1794],
        [0,0,0,3,-1749],
        [0,1,-1,1,-1565],
        [1,0,0,1,-1491],
        [0,1,1,1,-1475],
        [0,1,1,-1,-1410],
        [0,1,0,-1,-1344],
        [1,0,0,-1,-1335],
        [0,0,3,1,1107],
        [4,0,0,-1,1021],
        [4,0,-1,1,833],
        [0,0,1,-3,777],
        [4,0,-2,1,671],
        [2,0,0,-3,607],
        [2,0,2,-1,596],
        [2,-1,1,-1,491],
        [2,0,-2,1,-451],
        [0,0,3,-1,439],
        [2,0,2,1,422],
        [2,0,-3,-1,421],
        [2,1,-1,1,-366],
        [2,1,0,1,-351],
        [4,0,0,1,331],
        [2,-1,1,1,315],
        [2,-2,0,-1,302],
        [0,0,1,3,-283],
        [2,1,1,-1,-229],
        [1,1,0,-1,223],
        [1,1,0,1,223],
        [0,1,-2,-1,-220],
        [2,1,-1,-1,-220],
        [1,0,1,1,-185],
        [2,-1,-2,-1,181],
        [0,1,2,1,-177],
        [4,0,-2,-1,176],
        [4,-1,-1,-1,166],
        [1,0,1,-1,-164],
        [4,0,1,-1,132],
        [1,0,-1,-1,-119],
        [4,-1,0,-1,115],
        [2,-2,0,1,107]
    ]
}
