#version 330 compatibility
// you can set these uniform variables  dynamically or hardwire them:
uniform float uKa, uKd, uKs; // coefficients of each type of lighting
uniform float uShininess; // specular exponent

// these have to be set dynamically from glman sliders or keytime animations:
uniform float uAd, uBd;
// uniform float uTol;
// uniform float uMix;

// in variables from the vertex shader:
in vec2 vST; // texture cords
in vec3 vN; // normal vector
in vec3 vL; // vector from point to light
in vec3 vE; // vector from point to eye
in vec3 vMCposition;
// in vec3 vXYZ;


const vec3 WHITE = vec3(1., 1., 1.);
vec3 PURPLE = vec3(0.69, 0.09, 0.92);


void
main( )
{
	vec3 Normal = normalize(vN);
	vec3 Light = normalize(vL);
	vec3 Eye = normalize(vE);
	// vec3 myColor = vec3( 0.2, 0.6, 0.85 );		// whatever default color you'd like
	vec3 myColor = vec3(.90, .91, .98);
	vec3 mySpecularColor = vec3( 1., 1., 1. );	// whatever default color you'd like

	float S = vST.s;
	float T = vST.t;
	float Ar = uAd / 2.;
	float Br = uBd / 2.;
	int numins = int(S / uAd);
	int numint = int(T / uBd);
	float Sc = numins * uAd + Ar;
	float Tc = numint * uBd + Br;

	if (vMCposition.x > 7.2) {
		// myColor = mix(PURPLE, WHITE, uMix);
		myColor = PURPLE;
	}
	


	// here is the per-fragment lighting:
	vec3 ambient = uKa * myColor;
	float d = 0.;
	float s = 0.;
	if( dot(Normal,Light) > 0. ) // only do specular if the light can see the point
	{
		d = dot(Normal,Light);
		vec3 ref = normalize( reflect( -Light, Normal ) ); // reflection vector
		s = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec3 diffuse =  uKd * d * myColor;
	vec3 specular = uKs * s * mySpecularColor;
	gl_FragColor = vec4( ambient + diffuse + specular, 1. );
}