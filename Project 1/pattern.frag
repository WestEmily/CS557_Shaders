#version 330 compatibility
// you can set these uniform variables  dynamically or hardwire them:
uniform float uKa, uKd, uKs; // coefficients of each type of lighting
uniform float uShininess; // specular exponent

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

	float S = vST.s;
	float T = vST.t;
	float Ar = uAd / 2.;
	float Br = uBd / 2.;
	int numins = int(S / uAd);
	int numint = int(T / uBd);
	float Sc = numins * uAd + Ar;
	float Tc = numint * uBd + Br;
	

	// set myColor by using the ellipse equation to create a smooth blend between the ellipse color and the background color >>
	// now use myColor in the lighting equations >>
	// (s-sc)2 / Ar2 + (t-tc)2 / Br2 = 1

	float ellipse_equation = pow((S - Sc) / Ar, 2) + pow((T - Tc) / Br, 2);

	
	if(1. - uTol <= ellipse_equation && ellipse_equation <= 1. + uTol)
	{
		//myColor = vec3( 0.1, .4, 0.8 );
		float t = smoothstep(1.-uTol, 1.+uTol, ellipse_equation);
		myColor = mix(BLUE, WHITE, t);
	}


	if(ellipse_equation <= 1.-uTol)
	{
		myColor = vec3(0.1, 0.4, 0.8);
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