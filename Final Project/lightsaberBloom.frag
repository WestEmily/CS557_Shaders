#version 330 compatibility
// you can set these uniform variables  dynamically or hardwire them:
uniform float uKa, uKd, uKs; // coefficients of each type of lighting
uniform float uShininess; // specular exponent

// these have to be set dynamically from glman sliders or keytime animations:
uniform float uAd, uBd;
uniform float uBlurRadius;

// in variables from the vertex shader:
in vec2 vST; // texture cords
in vec3 vN; // normal vector
in vec3 vL; // vector from point to light
in vec3 vE; // vector from point to eye
in vec3 vMCposition;
// in vec3 vXYZ;

//vec2 screenSize = vec2(1024, 1024);
uniform vec2 screenSize;
uniform sampler2D uTexUnit;

// uniform sampler2D sceneTexture;


const vec3 WHITE = vec3(1., 1., 1.);
vec3 PURPLE = vec3(0.69, 0.09, 0.92);

float gaussian(float x, float sigma) {
    return exp(-(x * x) / (2.0 * sigma * sigma)) / (sqrt(2.0 * 3.14159) * sigma);
}


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
	} else {
		discard;
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
	// gl_FragColor = vec4( ambient + diffuse + specular, 1. );

	vec2 texelSize = 1.0 / screenSize;
    vec4 blurColor = vec4(PURPLE, 1.0);
    float totalWeight = 0.0;

    // Horizontal blur pass
    for (float i = -uBlurRadius; i <= uBlurRadius; i += 1.0) {
        float offset = i * texelSize.x;
        blurColor += texture(uTexUnit, gl_FragCoord.xy + vec2(offset, 0.0)) * gaussian(i, uBlurRadius);
        totalWeight += gaussian(i, uBlurRadius);
    }

    // Normalize the blur color
    blurColor /= totalWeight;

    // Output the result
    gl_FragColor = blurColor;

	
	
	// vec4 FragColor = vec4( ambient + diffuse + specular, 1. );

    // check whether fragment output is higher than threshold, if so output as brightness color
    // float brightness = dot(gl_FragColor.rgb, vec3(0.2126, 0.7152, 0.0722));
    // if(brightness > 1.0)
    //     vec4 BrightColor = vec4(gl_FragColor.rgb, 1.0);
    // else
    //     vec4 BrightColor = vec4(0.0, 0.0, 0.0, 1.0);

	// gl_FragColor = FragColor;
}