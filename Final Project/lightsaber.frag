#version 330 compatibility
// you can set these uniform variables  dynamically or hardwire them:
uniform float uKa, uKd, uKs; // coefficients of each type of lighting
uniform float uShininess; // specular exponent
uniform float uBlurRadius;
uniform int kernelSize;

// these have to be set dynamically from glman sliders or keytime animations:
uniform float uAd, uBd;

uniform vec2 screenSize;
uniform sampler2D uTexUnit;

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

	// const int kernelSize = 5;
	const float blurStrength = 0.5; // Adjust as needed
	vec3 ambient;
	vec4 blurColor;

	if (vMCposition.x > 7.2) {
		// myColor = mix(PURPLE, WHITE, uMix);
		// myColor = PURPLE;
		myColor = WHITE;

		// blur algorithm
		//vec2 texelSize = 1.0 / screenSize;
    	//vec2 texCoord = gl_FragCoord.xy / screenSize;
		//blurColor = vec4(PURPLE, 1.0);
		//for (int i = -kernelSize; i <= kernelSize; ++i) {
		//	for (int j = -kernelSize; j <= kernelSize; ++j) {
		//		vec2 offset = vec2(i, j) * texelSize;
		//		blurColor += texture(uTexUnit, texCoord + offset);
		//	}
		//}
		//blurColor /= float((2 * kernelSize + 1) * (2 * kernelSize + 1));
		
		// Apply blur strength
		//  blurColor *= uBlurRadius;
		blurColor = vec4(PURPLE, 1.);
		ambient = uKa * PURPLE * 100.;

		
	} else {
		ambient = uKa * myColor;
	}

	
	


	// here is the per-fragment lighting:
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
	// gl_FragColor = vec4( ambient + diffuse + specular, 1. );
	vec4 originalColor = vec4( ambient + diffuse + specular, 1. );
	vec4 finalColor = originalColor + blurColor;
	gl_FragColor = finalColor;
}