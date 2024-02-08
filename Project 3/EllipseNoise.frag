#version 330 compatibility
// you can set these uniform variables  dynamically or hardwire them:
uniform float uKa, uKd, uKs; // coefficients of each type of lighting
uniform float uShininess; // specular exponent

uniform float uNoiseAmp, uNoiseFreq;
uniform bool uUseXYZforNoise;
uniform vec3 uColor;

uniform sampler2D Noise2;
uniform sampler3D Noise3;

// these have to be set dynamically from glman sliders or keytime animations:
uniform float uAd, uBd;
uniform float uTol;

// in variables from the vertex shader:
in vec2 vST; // texture cords
in vec3 vN; // normal vector
in vec3 vL; // vector from point to light
in vec3 vE; // vector from point to eye
in vec3 vMCposition;

const vec3 WHITE = vec3(1., 1., 1.);
const vec3 BLUE = vec3(0.1, .4, 0.8);

void
main( )
{
	vec3 Normal = normalize(vN);
	vec3 Light = normalize(vL);
	vec3 Eye = normalize(vE);
	vec3 myColor = vec3( 1., 1., 1. );		// whatever default color you'd like
	vec3 mySpecularColor = vec3( 1., 1., 1. );	// whatever default color you'd like


	vec4 nv;
	if( uUseXYZforNoise )
		nv  = texture( Noise3, uNoiseFreq*vMCposition );
	else
		nv  = texture( Noise2, uNoiseFreq*vST );

	// give the noise a range of [-1.,+1.]:
	float n = nv.r + nv.g + nv.b + nv.a;    //  1. -> 3.
	n = n - 2.;                             // -1. -> 1.
	n *= uNoiseAmp;
	

	float S = vST.s;
	float T = vST.t;
	float Ar = uAd / 2.;
	float Br = uBd / 2.;
	int numins = int(S / uAd);
	int numint = int(T / uBd);
	float Sc = numins * uAd + Ar;
	float Tc = numint * uBd + Br;

	float ds = S - Sc;
	float dt = T - Tc;
	float oldDist = sqrt(ds*ds + dt*dt);
	float newDist = oldDist + n;
	float scale = newDist / oldDist;

	ds *= scale;		// scale by noise factor
	ds /= Ar;			// ellipse equation
	dt *= scale;		// scale by noise factor
	dt /= Br;			// ellipse equation
	float d = ds*ds + dt*dt;
	float t = smoothstep(1.-uTol, 1.+uTol, d);
	myColor = mix(BLUE, WHITE, t);


	vec3 newColor = vec3(1., .7, 0.);

	// here is the per-fragment lighting:
	vec3 ambient = uKa * newColor;
	float dd = 0.;
	float s = 0.;
	if( dot(Normal,Light) > 0. ) // only do specular if the light can see the point
	{
		dd = dot(Normal,Light);
		vec3 ref = normalize( reflect( -Light, Normal ) ); // reflection vector
		s = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec3 diffuse =  uKd * dd * newColor;
	vec3 specular = uKs * s * mySpecularColor;
	gl_FragColor = vec4( ambient + diffuse + specular, 1. );
}